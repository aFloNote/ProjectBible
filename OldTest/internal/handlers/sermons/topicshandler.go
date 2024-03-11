package handlerSermon

import (
	"context"
	"log"

	"encoding/json"
	"fmt"

	"net/http"

	"os"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
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
func fetchTopics(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
    w.Header().Set("Content-Type", "application/json")

    // Fetch author data from the database
    rows, err := db.Query("SELECT topic_id, name, image_path,slug FROM topics")
    if err != nil {
        fmt.Fprintf(os.Stderr,"Error query: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    topics := []types.TopicType{}
    for rows.Next() {
        var topic types.TopicType
        err := rows.Scan(&topic.TopicID, &topic.Name, &topic.Image_Path, &topic.Slug)
        if err != nil {
            fmt.Fprintf(os.Stderr,"Error scaning rows: %v", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        topics = append(topics, topic)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Encode the authors slice to JSON and write it to the response
    if err := json.NewEncoder(w).Encode(topics); err != nil {
        fmt.Fprintf(os.Stderr,"Error encorder: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }


}
func PubFetchTopicsHandler() http.Handler {
    return http.HandlerFunc(fetchTopics)
}

func FetchTopicsHandler() http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(fetchTopics),
    )
}


func AddTopicsHandler(minioClient *minio.Client,index *search.Index) http.Handler {
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
            name := r.FormValue("name")
            slug := slug.Make(name)
            topicID := uuid.New()
            // Get the image file from the form
            
			path:= fmt.Sprintf("sermons/topics/%s/image/%s",slug, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo,err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

			 // Attempt to insert author information into the database
             fmt.Println(path)
			query := "INSERT INTO topics (topic_id,name, image_path, slug) VALUES ($1, $2, $3,$4)"
			_, err = db.Exec(query, topicID,name, path,slug) // Note: Using path as MinIO doesn't return a URL in uploadInfo
			if err != nil {
				// If the query fails, attempt to remove the uploaded file from MinIO
				errRemove := minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, minio.RemoveObjectOptions{})
				if errRemove != nil {
					// Log or handle the error occurred during file removal
					
					fmt.Fprintf(os.Stderr, "Failed to remove uploaded file after DB error: %v\n", errRemove)
				}

				// Return or handle the original database error
			
				http.Error(w, "Failed to insert topic into database: "+err.Error(), http.StatusInternalServerError)
				return
			}
			// Example: Get the ID of the last inserted row (if supported by your DB)
			record := types.TopicSearch{
				ObjectID:  slug,
                Name:      name,   
			}
			_, err = index.SaveObject(record)
            if err != nil {
                fmt.Fprintf(os.Stderr, "Failed to add topic to Algolia index: %v\n", err)
                http.Error(w, "Failed to add topic to Algolia index: "+err.Error(), http.StatusInternalServerError)
                return
            }

            // Write the author string to the response
            if _, err := w.Write([]byte("Topic Added")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}
func UpdateTopicsHandler(minioClient *minio.Client,index *search.Index) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
        
            name := r.FormValue("name")
            slug := slug.Make(name)
           ID:=r.FormValue("topic_id")

          
            
            
            imgPath,err:=fileStorage.ProcessPathFiles(minioClient, "topic", "image", r, slug)
            if err!=nil{      
                fmt.Fprintf(os.Stderr, "upload file error: %v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return

            }
            query := "UPDATE topics SET name = $1,image_path =$2, slug= $3 WHERE topic_id = $4"
            fmt.Println("Image path is in the database")
            // Execute SQL statement
            _, err = db.Exec(query, name,imgPath,slug,ID)
            if err != nil {
                log.Fatal(err)
            }
            doneCh := make(chan struct{})

// Indicate to our routine to exit cleanly upon return.
            defer close(doneCh)

        }),
    )
}

func DeleteTopicsHandler(minioClient *minio.Client,index *search.Index) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
     
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
         
            topicID := r.FormValue("id")
            slug:= r.FormValue("slug")

          
            _, err := db.Exec("DELETE FROM topics WHERE topic_id=$1", topicID)
            if err != nil {
                http.Error(w, "Failed to delete author", http.StatusInternalServerError)
                return
            }
            // Get the prefix for the objects to delete
            prefix := fmt.Sprintf("sermons/topics/%s/",slug )

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
            w.Write([]byte("Topic deleted successfully"))
        }),
    )
}