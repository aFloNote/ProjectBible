package handlerSermon

import (
	"context"
	"database/sql"

	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	db "github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	fileStorage "github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/types"
	"github.com/gosimple/slug"
	"github.com/minio/minio-go/v7"
	// Import other necessary packages
)

// Author represents the structure of your author data

// AuthorsHandler handles the /api/authors endpoint
func fetchScriptures(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
    w.Header().Set("Content-Type", "application/json")

    // Fetch author data from the database
    rows, err := db.Query("SELECT scripture_id, book, image_path,slug FROM scriptures")
    if err != nil {
        fmt.Fprintf(os.Stderr,"Error query: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    scriptures := []types.ScriptureType{}
    for rows.Next() {
        var scripture types.ScriptureType
        err := rows.Scan(&scripture.ScriptureID, &scripture.Book, &scripture.Image_Path, &scripture.Slug)
        if err != nil {
            fmt.Fprintf(os.Stderr,"Error scaning rows: %v", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        scriptures = append(scriptures, scripture)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Encode the authors slice to JSON and write it to the response
    if err := json.NewEncoder(w).Encode(scriptures); err != nil {
        fmt.Fprintf(os.Stderr,"Error encorder: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }


}
func PubFetchScriptures(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
    w.Header().Set("Content-Type", "application/json")

    // Fetch author data from the database
    rows, err := db.Query("SELECT s.scripture_id, s.book, s.image_path, s.slug FROM scriptures s INNER JOIN sermons se ON s.scripture_id = se.scripture_id")
    if err != nil {
        fmt.Fprintf(os.Stderr,"Error query: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    scriptures := []types.ScriptureType{}
    for rows.Next() {
        var scripture types.ScriptureType
        err := rows.Scan(&scripture.ScriptureID, &scripture.Book, &scripture.Image_Path, &scripture.Slug)
        if err != nil {
            fmt.Fprintf(os.Stderr,"Error scaning rows: %v", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        scriptures = append(scriptures, scripture)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Encode the authors slice to JSON and write it to the response
    if err := json.NewEncoder(w).Encode(scriptures); err != nil {
        fmt.Fprintf(os.Stderr,"Error encorder: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }


}
func PubFetchScripturesHandler() http.Handler {
    return http.HandlerFunc(PubFetchScriptures)
}

func FetchScripturesHandler() http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(fetchScriptures),
    )
}



func UpdateScripturesHandler(minioClient *minio.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
        
            book := r.FormValue("book")
        
            scriptureID := r.FormValue("scripture_id")
          
            slug := slug.Make(book)
           

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

            if !strings.HasPrefix(decodedURL, "sermons/scriptures") {
                queryPath := "SELECT image_path FROM scriptures WHERE scripture_id = $1"

                // Execute SQL statement
                row := db.QueryRow(queryPath, scriptureID)

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
            path:= fmt.Sprintf("sermons/scriptures/%s/image/%s", slug, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo,err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            query := "UPDATE scriptures SET image_path = $1, slug= $2 WHERE scripture_id = $3"
            
            // Execute SQL statement
            _, err = db.Exec(query,path,slug,scriptureID)
            if err != nil {
                log.Fatal(err)
            }
            }
            doneCh := make(chan struct{})

// Indicate to our routine to exit cleanly upon return.
            defer close(doneCh)


            // Write the author string to the response
            if _, err := w.Write([]byte("Scripture Updated")); err != nil {
                fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}

