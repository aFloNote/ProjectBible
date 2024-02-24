package handlerSermon

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/minio/minio-go/v7"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	db "github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	fileStorage "github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	// Import other necessary packages
)

// Author represents the structure of your author data
type Sermon struct {
    SermonId        int    `json:"sermon_id"`
	Title       string `json:"title"`
	DateDelivered time.Time `json:"date_delivered"`
	AudioLink string `json:"audio_link"`
	AuthorId  int    `json:"author_id"`
	SeriesId   int    `json:"series_id"`
	Scripture string `json:"scripture"`
    Desc sql.NullString
    ImagePath  sql.NullString
	
	

}

// AuthorsHandler handles the /api/authors endpoint
func fetchSermons(w http.ResponseWriter, r *http.Request) {
	
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
    w.Header().Set("Content-Type", "application/json")
	
    // Fetch author data from the database
    rows, err := db.Query("SELECT * FROM  sermons ORDER BY date_delivered DESC")
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error query: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()
	fmt.Println("Hello, World!3") 
    allsermons := []Sermon{}
    for rows.Next() {
        var sermon Sermon
		err := rows.Scan(&sermon.SermonId,&sermon.Title ,&sermon.DateDelivered, &sermon.AudioLink, &sermon.AuthorId,&sermon.SeriesId, &sermon.Scripture ,&sermon.Desc , &sermon.ImagePath,)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error scanning rows: %v", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        allsermons = append(allsermons, sermon)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
	
    // Encode the authors slice to JSON and write it to the response
    if err := json.NewEncoder(w).Encode(allsermons); err != nil {
        fmt.Fprintf(os.Stderr,"Error encorder: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
}

func PubFetchSermonHandler() http.Handler {
    return http.HandlerFunc(fetchSermons)
}

func FetchSermonHandler() http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(fetchSermons),
    )
}

func AddSermonHandler(minioClient *minio.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // CORS Headers.
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain") // Change this to text/plain
			
            file, header,contentType, err := fileStorage.ParseFile(r, 10<<20,"audio") // Use the actual form field name
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process fil error: %v\n", err)
				w.Write([]byte(`{""Failed to process uploaded file: " + err.Error()"}`))
			
				return
			}
			defer file.Close()

            // Get form data
            title := r.FormValue("title")
            scripture := r.FormValue("scripture")
			authid, err := strconv.Atoi(r.FormValue("author_id"))
			if err != nil {
				// handlfmt.Fprintf(os.Stderr, "Process fil error: %v\n", err)
				fmt.Fprintf(os.Stderr, "Process auhor_id error: %v\n", err)
				w.Write([]byte(`{""Failed to process author_id: " + err.Error()"}`))
			}
			seriesid, err := strconv.Atoi(r.FormValue("series_id"))
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process series_id error: %v\n", err)
				w.Write([]byte(`{""Failed to process series_id: " + err.Error()"}`))
				// handle error
			}
            
			dateStr := r.FormValue("date") // assuming this is your date field
			layout := "2006-01-02T15:04:05Z"
			
			location, err := time.LoadLocation("America/Denver") // Mountain Time
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process timezone error: %v\n", err)
				w.Write([]byte(`{""Failed to process timezone " + err.Error()"}`))
				// handle error
			}
			
			t, err := time.ParseInLocation(layout, dateStr, location)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process time error: %v\n", err)
				w.Write([]byte(`{""Failed to time " + err.Error()"}`))
			}
            // Get the image file from the form
			fmt.Printf("Size: %v, Content Type: %s\n", header.Size, contentType)
			path:= fmt.Sprintf("sermons/sermons/%s/audio/%s", title, header.Filename)
			// Start the timer
			start := time.Now()

			// Upload the file
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})

			// Stop the timer
			elapsed := time.Since(start)

			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to upload file to MinIO. Upload info: %+v, Error: %v\n", upLoadInfo, err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

// Calculate the upload speed
speed := float64(header.Size) / elapsed.Seconds()

fmt.Printf("Uploaded %s in %v at %f bytes/second\n", header.Filename, elapsed, speed)
			
			 // Attempt to insert author information into the database
            fmt.Println("Title before database query: ", title)
			query := "INSERT INTO sermons (title, date_delivered, audio_link, series_id, author_id, scripture) VALUES ($1, $2, $3,$4,$5,$6)"
			_, err = db.Exec(query, title, t,path, seriesid,authid,scripture) // Note: Using path as MinIO doesn't return a URL in uploadInfo
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