package handlerSermon

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"net/http"
	"net/url"
	"os"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	db "github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	fileStorage "github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/types"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/minio/minio-go/v7"
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
    // Fetch author data from the database
    query :=`SELECT DISTINCT ON (s.series_id) s.series_id, s.title, s.description, s.image_path, s.slug 
          FROM series s `
var err error

var rows *sql.Rows
if authorID !="" {
    fmt.Println("Author ID: ", authorID) // Print author id to console
    query += "INNER JOIN sermons se ON s.series_id = se.series_id WHERE se.author_id = $1 ORDER BY s.series_id ASC"
    
    rows, err = db.Query(query, authorID)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error query: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
} else{
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
        err := rows.Scan(&series.SeriesID, &series.Title, &series.Desc, &series.Image_Path, &series.Slug)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error scanning rows: %v", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        allseries = append(allseries, series)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Encode the authors slice to JSON and write it to the response
    if err := json.NewEncoder(w).Encode(allseries); err != nil {
        fmt.Fprintf(os.Stderr,"Error encorder: %v", err)
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

func AddSeriesHandler(minioClient *minio.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // CORS Headers.
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain") // Change this to text/plain
			
            file, header,contentType, err := fileStorage.ParseFile(r, 10<<20,"image") // Use the actual form field name
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
            
			path:= fmt.Sprintf("sermons/series/%s/image/%s", seriesID, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo,err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            
			 // Attempt to insert author information into the database
            fmt.Println("Title before database query: ", title)
			query := "INSERT INTO series (series_id,title, description,image_path,slug) VALUES ($1, $2, $3,$4, $5)"
			_, err = db.Exec(query, seriesID,title, desc,path,slug) // Note: Using path as MinIO doesn't return a URL in uploadInfo
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
			// Example: Get the ID of the last inserted row (if supported by your DB)
            fmt.Println("theTitle is ",title)
			

            // Write the author string to the response
            if _, err := w.Write([]byte("Author Added")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}

func UpdateSeriesHandler(minioClient *minio.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
        
            title := r.FormValue("head")
            desc := r.FormValue("desc")
            seriesId := r.FormValue("series_id")
            slug := slug.Make(title)
           

            // Check if image path is alr fmt.Print("Update Author")
            file, header, contentType, err := fileStorage.ParseFile(r, 10<<20, "image") 
            if err != nil {
                fmt.Fprintf(os.Stderr, "Process file error: %v\n", err)
            w.Write([]byte(`{"Failed to process uploaded file: " + err.Error()}`))
            return
            }
            defer file.Close()

            decodedURL, err := url.QueryUnescape(header.Filename)
            if err != nil {
             fmt.Println("Error:", err)
            return
            }
            
            
          
            // If image path is in the database, process the new image

            if strings.HasPrefix(decodedURL, "sermons/series") {
                // Prepare SQL statement to get the current image path
                
              
                //fmt.Println("Image path is in the database")
                fmt.Println(decodedURL)
                // Prepare SQL statement
                query := "UPDATE series SET title = $1, description = $2, slug= $3 WHERE series_id = $4"
            
                // Execute SQL statement
                _, err = db.Exec(query, title, desc,slug, seriesId)
                if err != nil {
                    log.Fatal(err)
                }
            } else {
                queryPath := "SELECT image_path FROM series WHERE series_id = $1"

                // Execute SQL statement
                row := db.QueryRow(queryPath, seriesId)

                // Declare a variable to hold the image path
                var imagePath string

                // Scan the result into the imagePath variable
                err := row.Scan(&imagePath)
                if err != nil {
                    if err == sql.ErrNoRows {
                        http.Error(w, err.Error(), http.StatusInternalServerError)
                    } else {
                        http.Error(w, err.Error(), http.StatusInternalServerError)
                    }
                }
                fmt.Println("Image path to be removed")
                fmt.Println(imagePath)
                errRemove := minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), imagePath, minio.RemoveObjectOptions{})
				if errRemove != nil {
					// Log or handle the error occurred during file removal
					
					fmt.Fprintf(os.Stderr, "Failed to remove uploaded file after DB error: %v\n", errRemove)
				}
            path:= fmt.Sprintf("sermons/series/%s/image/%s", seriesId, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo,err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            query := "UPDATE series SET title = $1, description = $2, image_path = $3,slug=$4 WHERE series_id = $5"
            
            // Execute SQL statement
            _, err = db.Exec(query, title, desc, path,slug,seriesId)
            if err != nil {
                log.Fatal(err)
            }
            }
            doneCh := make(chan struct{})

// Indicate to our routine to exit cleanly upon return.
            defer close(doneCh)

            isRecursive := true
            objectCh := minioClient.ListObjects(context.Background(), os.Getenv("STORAGE_BUCKET"), minio.ListObjectsOptions{Recursive: isRecursive})

            for object := range objectCh {
                if object.Err != nil {
                    fmt.Println(object.Err)
                    return
                }
                fmt.Println(object.Key)
            }

            // Write the author string to the response
            if _, err := w.Write([]byte("Series Updated")); err != nil {
                fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}

func DeleteSeriesHandler(minioClient *minio.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Print("Inside handler function") // New print statement
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
         
            series_id := r.FormValue("id")

            
            _, err := db.Exec("DELETE FROM series WHERE series_id=$1", series_id)
            if err != nil {
                http.Error(w, "Failed to delete series", http.StatusInternalServerError)
                return
            }
            // Get the prefix for the objects to delete
            prefix := fmt.Sprintf("sermons/series/%s/", series_id)

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
            w.WriteHeader(http.StatusOK)
            w.Write([]byte("Series deleted successfully"))
        }),
    )
}

