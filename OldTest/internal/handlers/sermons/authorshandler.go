package handlerSermon

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	
	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	db "github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	fileStorage "github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/types"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/minio/minio-go/v7"
	"github.com/typesense/typesense-go/typesense"
	"github.com/aFloNote/ProjectBible/OldTest/internal/search"
	// Import other necessary packages
)

// Author represents the structure of your author data

// AuthorsHandler handles the /api/authors endpoint
func fetchAuthors(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
    w.Header().Set("Content-Type", "application/json")

    // Fetch author data from the database
    rows, err := db.Query("SELECT author_id, name, ministry, image_path, bio_link,slug FROM authors")
    if err != nil {
        fmt.Fprintf(os.Stderr,"Error query: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    authors := []types.AuthorType{}
    for rows.Next() {
        var author types.AuthorType
        err := rows.Scan(&author.AuthorID, &author.Name, &author.Ministry, &author.Image_Path,&author.Bio_Link, &author.Slug)
        if err != nil {
            fmt.Fprintf(os.Stderr,"Error scaning rows: %v", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        authors = append(authors, author)
    }

    // Check for errors from iterating over rows.
    if err := rows.Err(); err != nil {
        fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Encode the authors slice to JSON and write it to the response
    if err := json.NewEncoder(w).Encode(authors); err != nil {
        fmt.Fprintf(os.Stderr,"Error encorder: %v", err)
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }


}
func PubFetchAuthorsHandler() http.Handler {
    return http.HandlerFunc(fetchAuthors)
}

func FetchAuthorsHandler() http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(fetchAuthors),
    )
}


func AddAuthorsHandler(minioClient *minio.Client,client *typesense.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            // CORS Headers.
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain") // Change this to text/plain
		
            authorID := uuid.New()
            file, header,contentType, err := fileStorage.ParseFile(r, 10<<20,"image") // Use the actual form field name
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process fil error: %v\n", err)
				w.Write([]byte(`{""Failed to process uploaded file: " + err.Error()"}`))
			
				return
			}
			defer file.Close()

            // Get form data
            name := r.FormValue("head")
            ministry := r.FormValue("desc")
            biolink:=r.FormValue("biolink")
            slug := slug.Make(name)

            // Get the image file from the form
            
			path:= fmt.Sprintf("sermons/author/%s/image/%s", slug, header.Filename)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo,err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

			 // Attempt to insert author information into the database
			query := "INSERT INTO authors (author_id,name, ministry,bio_link, image_path, slug) VALUES ($1, $2, $3,$4,$5,$6)"
			_, err = db.Exec(query, authorID,name, ministry,biolink, path,slug) // Note: Using path as MinIO doesn't return a URL in uploadInfo
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
		
			topicDocument := types.AuthorType{
				AuthorID:   authorID.String(),
				Name:      name,
				Ministry: ministry,
				Image_Path: path,
				Slug:      slug,
			}
			
			_, err = client.Collection("authors").Documents().Create(context.Background(), topicDocument)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)
				http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
				return
			}
            // Write the author string to the response
            if _, err := w.Write([]byte("Author Added")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}
func UpdateAuthorsHandler(minioClient *minio.Client,client *typesense.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
        
            name := r.FormValue("head")
            ministry := r.FormValue("desc")
            ID := r.FormValue("author_id")
            biolink:=r.FormValue("biolink")
            slug := slug.Make(name)
           

            imgPath,err:=fileStorage.ProcessPathFiles(minioClient, "author", "image", r, slug)
            if err!=nil{      
                fmt.Fprintf(os.Stderr, "upload file error: %v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return

            }
            query := "UPDATE authors SET name = $1, ministry = $2, image_path =$3, bio_link =$4, slug= $5 WHERE author_id = $6"
            fmt.Println("Image path is in the database")
            // Execute SQL statement
            _, err = db.Exec(query, name,ministry,imgPath,biolink,slug,ID)
            if err != nil {
                log.Fatal(err)
            }
            doneCh := make(chan struct{})


            defer close(doneCh)
			updateData := map[string]interface{}{
				"'author_id":   ID,
				"name":      name,
				"ministry": ministry,
				"image_path": imgPath,
				"slug":      slug,
			}
			search.UpdateDocument(client, ID, "author_id", "authors", updateData)
            // Write the author string to the response
            if _, err := w.Write([]byte("Author Updated")); err != nil {
                fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}

func DeleteAuthorsHandler(minioClient *minio.Client,client *typesense.Client) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Print("Inside handler function") // New print statement
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
         
            author_id := r.FormValue("id")

            fmt.Print(author_id)
            _, err := db.Exec("DELETE FROM authors WHERE author_id=$1", author_id)
            if err != nil {
                http.Error(w, "Failed to delete author", http.StatusInternalServerError)
                return
            }
            // Get the prefix for the objects to delete
            prefix := fmt.Sprintf("sermons/author/%s/", author_id)

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
			search.DeleteDocument(client, author_id, "author_id","authors")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte("Author deleted successfully"))
        }),
    )
}