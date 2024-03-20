package handlerSermon

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	db "github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	"github.com/aFloNote/ProjectBible/OldTest/internal/search"
	fileStorage "github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/types"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/minio/minio-go/v7"
	"github.com/typesense/typesense-go/typesense"
	// Import other necessary packages
)

// Author represents the structure of your author data

// AuthorsHandler handles the /api/authors endpoint
func fetchSeries(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
	w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	w.Header().Set("Content-Type", "application/json")
	params := r.URL.Query()
	authorID := params.Get("author_id")
	fmt.Println("Author ID: ", authorID) // Print author id to console
	// Fetch author data from the database
	query := `SELECT DISTINCT ON (s.series_id) s.series_id, s.title, s.description, s.image_path, s.slug 
          FROM series s `
	var err error

	var rows *sql.Rows
	if authorID != "" {
		fmt.Println("Author ID: ", authorID) // Print author id to console
		query += "INNER JOIN sermons se ON s.series_id = se.series_id INNER JOIN authors a ON se.author_id = a.author_id WHERE a.slug = $1 ORDER BY s.series_id ASC"

		rows, err = db.Query(query, authorID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error query: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		query += " ORDER BY s.series_id ASC"
		rows, err = db.Query(query)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error query: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	defer rows.Close()

	allseries := []types.SeriesType{}
	for rows.Next() {
		var series types.SeriesType
		err := rows.Scan(&series.SeriesID, &series.Title, &series.Description, &series.Image_Path, &series.Slug)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error scanning rows: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		allseries = append(allseries, series)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error getting rows: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Encode the authors slice to JSON and write it to the response
	if err := json.NewEncoder(w).Encode(allseries); err != nil {
		fmt.Fprintf(os.Stderr, "Error encorder: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}
func PubFetchSeriesHandler() http.Handler {
	return http.HandlerFunc(fetchSeries)
}

func FetchSeriesHandler() http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(fetchSeries),
	)
}

func AddSeriesHandler(minioClient *minio.Client, client *typesense.Client) http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")
			w.Header().Set("Content-Type", "text/plain") // Change this to text/plain

			file, header, contentType, err := fileStorage.ParseFile(r, 10<<20, "image") // Use the actual form field name
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process fil error: %v\n", err)
				w.Write([]byte(`{""Failed to process uploaded file: " + err.Error()"}`))

				return
			}
			defer file.Close()

			// Get form data
			title := r.FormValue("head")
			desc := r.FormValue("desc")
			seriesID := uuid.New()
			slug := slug.Make(title)

			path := fmt.Sprintf("sermons/series/%s/image/%s", slug, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
			if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo, err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Attempt to insert author information into the database
			fmt.Println("Title before database query: ", title)
			query := "INSERT INTO series (series_id,title, description,image_path,slug) VALUES ($1, $2, $3,$4, $5)"
			_, err = db.Exec(query, seriesID, title, desc, path, slug) // Note: Using path as MinIO doesn't return a URL in uploadInfo
			if err != nil {
				// If the query fails, attempt to remove the uploaded file from MinIO
				errRemove := minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, minio.RemoveObjectOptions{})
				if errRemove != nil {
					// Log or handle the error occurred during file removal

					fmt.Fprintf(os.Stderr, "Failed to remove uploaded file after DB error: %v\n", errRemove)
				}

				// Return or handle the original database error

				http.Error(w, "Failed to insert Series into database: "+err.Error(), http.StatusInternalServerError)
				return
			}
			queryDate := `SELECT date_published from series where series_id = $1`

			var datePublished time.Time
			err = db.QueryRow(queryDate, seriesID).Scan(&datePublished)
			if err != nil {
				log.Fatal(err)
			}
			type SeriesTypeForTypesense struct {
				SeriesID       string `json:"series_id"`
				Title          string `json:"title"`
				Description           string `json:"description"`
				Image_Path     string `json:"image_path"`
				Date_Published string `json:"date_published"`
				Slug           string `json:"slug"`
			}
			seriesDocument := types.SeriesType{
				SeriesID:   seriesID.String(),
				Title:      title,
				Description:       desc,
				Image_Path: path,
				Date_Published: datePublished,
				Slug:       slug,
			}
			formattedDatePublished := seriesDocument.Date_Published.Format(time.RFC3339)
			documentForTypesense := SeriesTypeForTypesense{
				SeriesID:       seriesDocument.SeriesID,
				Title:          seriesDocument.Title,
				Description:           seriesDocument.Description,
				Image_Path:     seriesDocument.Image_Path,
				Date_Published: formattedDatePublished, // Use the formatted string
				Slug:           seriesDocument.Slug,
			}
			_, err = client.Collection("series").Documents().Create(context.Background(), documentForTypesense)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

			}
			searchDocument:=types.SearchType{
				ID:   seriesID.String(),
				Primary:   title,
				TheType: "series",
				Secondary: "",
				Slug:slug,
			}			
			_, err = client.Collection("search").Documents().Create(context.Background(), searchDocument)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

				http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
				return
			}
			// Write the author string to the response
			if _, err := w.Write([]byte("Series Added")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}),
	)
}

func UpdateSeriesHandler(minioClient *minio.Client, client *typesense.Client) http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")
			w.Header().Set("Content-Type", "text/plain")

			title := r.FormValue("head")
			desc := r.FormValue("desc")
			ID := r.FormValue("series_id")
			slug := slug.Make(title)
			fmt.Println(desc)
			imgPath, err := fileStorage.ProcessPathFiles(minioClient, "series", "image", r, slug)
			if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return

			}
			query := "UPDATE series SET title = $1,image_path =$2, description =$3, slug= $4 WHERE series_id = $5"
			fmt.Println("Image path is in the database")
			// Execute SQL statement
			_, err = db.Exec(query, title, imgPath, desc, slug, ID)
			if err != nil {
				log.Fatal(err)
			}
			doneCh := make(chan struct{})

			defer close(doneCh)
			updateData := map[string]interface{}{
				"series_id":   ID,
				"title":      title,
				"Description":	   desc,
				"image_path": imgPath,
				"slug":      slug,
			}
			search.UpdateDocument(client, ID, "series_id", "series", updateData)
			updateSearch := map[string]interface{}{
				"'id'":   ID,
				"primary":      title,
				"slug":      slug,
			}
			search.UpdateDocument(client, ID, "searchid", "search", updateSearch)
			// Write the author string to the response
			if _, err := w.Write([]byte("Series Updated")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}),
	)
}

func DeleteSeriesHandler(minioClient *minio.Client, client *typesense.Client) http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Print("Inside handler function") // New print statement
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")
			w.Header().Set("Content-Type", "text/plain")

			series_id := r.FormValue("id")
			slug:=r.FormValue("slug")
			_, err := db.Exec("DELETE FROM series WHERE series_id=$1", series_id)
			if err != nil {
				http.Error(w, "Failed to delete series", http.StatusInternalServerError)
				return
			}
			// Get the prefix for the objects to delete
			prefix := fmt.Sprintf("sermons/series/%s/", slug)

			fmt.Println("prefix")
			fmt.Println(prefix)
			for object := range minioClient.ListObjects(context.Background(), os.Getenv("STORAGE_BUCKET"), minio.ListObjectsOptions{Prefix: prefix, Recursive: true}) {
				fmt.Println(object.Key)
				if object.Err != nil {
					fmt.Fprintf(os.Stderr, "Error listing objects for deletion: %v\n", object.Err)
					return
				}

				errRemove := minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), object.Key, minio.RemoveObjectOptions{})
				if errRemove != nil {
					fmt.Fprintf(os.Stderr, "Failed to remove object: %v\n", errRemove)
				}
			}
			search.DeleteDocument(client, series_id, "series_id", "series")
			search.DeleteDocument(client, series_id, "searchid", "search")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Series deleted successfully"))
		}),
	)
}
