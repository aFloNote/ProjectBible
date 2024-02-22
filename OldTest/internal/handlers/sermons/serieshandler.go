package handlerSermon

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/minio/minio-go/v7"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	// Import other necessary packages
)

// Author represents the structure of your author data
type Series struct {
    ID          int    `json:"series_id"`
    Title       string `json:"title"`
    Description string `json:"description"`
    ImagePath   string `json:"image_path"`
    NumOfEps    int    `json:"num_of_eps"`
}

// AuthorsHandler handles the /api/authors endpoint

func FetchSeriesHandler() http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "application/json")

            // Fetch author data from the database
            rows, err := db.Query("SELECT series_id, title,description,num_of_eps,image_path FROM  series")
            if err != nil {
                fmt.Fprintf(os.Stderr, "Error query: %v", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            defer rows.Close()

            allseries := []Series{}
            for rows.Next() {
                var series Series
                err := rows.Scan(&series.ID, &series.Title, &series.Description, &series.NumOfEps, &series.ImagePath)
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
        }),
    )
}

func AddSeriesHandler(minioClient *minio.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // CORS Headers.
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
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
            fmt.Println("theTitle is ",title)
            // Get the image file from the form
            
			path:= fmt.Sprintf("sermons/series/%s/image/%s", title, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo,err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            
			 // Attempt to insert author information into the database
            fmt.Println("Title before database query: ", title)
			query := "INSERT INTO series (title, description, num_of_eps,image_path) VALUES ($1, $2, $3,$4)"
			_, err = db.Exec(query, title, desc,0, path) // Note: Using path as MinIO doesn't return a URL in uploadInfo
			if err != nil {
				// If the query fails, attempt to remove the uploaded file from MinIO
				errRemove := minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, minio.RemoveObjectOptions{})
				if errRemove != nil {
					// Log or handle the error occurred during file removal
					
					fmt.Fprintf(os.Stderr, "Failed to remove uploaded file after DB error: %v\n", errRemove)
				}

				// Return or handle the original database error
			
				http.Error(w, "Failed to insert author into database: "+err.Error(), http.StatusInternalServerError)
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