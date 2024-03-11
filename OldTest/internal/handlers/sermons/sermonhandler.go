package handlerSermon

import (
	"context"
	"database/sql"
	"log"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
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


func fetchSermons(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Hello, World!")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
    w.Header().Set("Content-Type", "application/json")

    // Get sermon ID from the request parameters, if present


	params := r.URL.Query()
    sermonID := params.Get("sermon_slug")
	authorSlug := params.Get("author_slug")
	seriesSlug := params.Get("series_slug") 
    // Start building the SQL query
    query := `
    SELECT 
        sermons.sermon_id, sermons.title, sermons.date_delivered, sermons.scripture, sermons.audio_path, sermons.series_id, sermons.author_id,sermons.scripture_id, sermons.slug,
        authors.author_id, authors.name, authors.ministry, authors.image_path, authors.slug,
        series.series_id, series.title, series.description, series.image_path, series.date_published, series.slug,
		topics.topic_id, topics.name,topics.image_path, topics.slug,
		scriptures.scripture_id, scriptures.book,scriptures.image_path, scriptures.slug
    FROM 
        sermons
    INNER JOIN 
        authors ON sermons.author_id = authors.author_id
    INNER JOIN 
        series ON sermons.series_id = series.series_id
	INNER JOIN 
        topics ON sermons.topic_id = topics.topic_id
	INNER JOIN 
        scriptures ON sermons.scripture_id = scriptures.scripture_id
    `

    // If a sermon ID was provided, add a WHERE clause to the query
	
	var err error
	var rows *sql.Rows
	
    if sermonID !="" {
		
   		
        query += "WHERE sermons.sermon_slug = $1 ORDER BY sermons.date_delivered DESC"
		rows, err = db.Query(query, sermonID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error querying the database for Sermons: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
    } else if authorSlug != "" {
		
		query += "WHERE authors.slug = $1 ORDER BY sermons.date_delivered DESC"
		rows, err = db.Query(query, authorSlug)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error querying the database for Sermons: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}	
		

	} else if seriesSlug != "" {
		
		query += "WHERE series.slug = $1 ORDER BY sermons.date_delivered DESC"
		rows, err = db.Query(query, seriesSlug)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error querying the database for Sermons: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}	else {
			query += "ORDER BY sermons.date_delivered DESC"
				rows, err = db.Query(query)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error querying the database for Sermons no param: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
	}


    // Execute the query
   

	defer rows.Close()

	sermons := []types.SermonFull{}

	for rows.Next() {
		var sermon types.SermonType
		var author types.AuthorType
		var series types.SeriesType 
		var topic types.TopicType
		var scripture types.ScriptureType

		err := rows.Scan(
			&sermon.SermonID, &sermon.Title, &sermon.DateDelivered, &sermon.Scripture, &sermon.Audio_Path, &sermon.SeriesID, &sermon.AuthorID, &sermon.ScriptureID, &sermon.Slug,
			&author.AuthorID, &author.Name, &author.Ministry, &author.Image_Path, &author.Slug,
			&series.SeriesID, &series.Title, &series.Desc, &series.Image_Path, &series.Date_Published, &series.Slug,
			&topic.TopicID, &topic.Name, &topic.Image_Path, &topic.Slug,
			&scripture.ScriptureID, &scripture.Book, &scripture.Image_Path, &scripture.Slug,
		)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Process Sermons error: %v\n", err)
			w.Write([]byte(`{""Failed to process series_id: " + err.Error()"}`))
		}

		sermons = append(sermons, types.SermonFull{
			SermonType: sermon,
			AuthorType: author,
			SeriesType: series,
			TopicType: topic,
			ScriptureType: scripture,
			
		})
	}
		fmt.Println("Sermons: ", sermons)
		// Check for errors from iterating over rows.
		if err = rows.Err(); err != nil {
			fmt.Fprintf(os.Stderr,"Error getting rows: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		// Encode the authors slice to JSON and write it to the response
		if err= json.NewEncoder(w).Encode(sermons); err != nil {
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

func AddSermonHandler(minioClient *minio.Client,index *search.Index) http.Handler {
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
			seriesid := r.FormValue("series_id")
			authid:= r.FormValue("author_id")
			topicid:= r.FormValue("topic_id")
			scriptid:= r.FormValue("scripture_id")
			
			sermonID := uuid.New()
            slug := slug.Make(title)
            
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
			path:= fmt.Sprintf("sermons/sermons/%s/audio/%s", slug, header.Filename)
			// Start the timer
		

			// Upload the file
			fmt.Println("Title before database query: ", seriesid)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})

			// Stop the timer
			

			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to upload file to MinIO. Upload info: %+v, Error: %v\n", upLoadInfo, err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

		
			
			 // Attempt to insert author information into the database
            fmt.Println("Title before database query: ", seriesid)
			query := "INSERT INTO sermons (sermon_id,title, date_delivered, audio_path, series_id, author_id, scripture, scripture_id,topic_id, slug) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10)"
			_, err = db.Exec(query, sermonID,title, t,path, seriesid,authid,scripture,scriptid,topicid,slug) // Note: Using path as MinIO doesn't return a URL in uploadInfo
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
			// Example: Get the ID of the last inserted row (if supported by your DB

            // Write the author string to the response
            if _, err := w.Write([]byte("Author Added")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}

func UpdateSermonHandler(minioClient *minio.Client,index *search.Index) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
      
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
			



            title := r.FormValue("title")
            script := r.FormValue("scripture")
            seriesId := r.FormValue("series_id")
			sermonId := r.FormValue("sermon_id")
			authorId := r.FormValue("author_id")
			topicId := r.FormValue("topic_id")
			scriptureId := r.FormValue("scripture_id")
			
            slug := slug.Make(title)
           
			
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
           

			audioPath,err:=fileStorage.ProcessPathFiles(minioClient, "sermon", "audio", r, slug)
            if err!=nil{      
                fmt.Fprintf(os.Stderr, "upload file error: %v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return

            }
            query := "UPDATE sermons SET title = $1, scripture = $2, scripture_id=$3, author_id=$4,series_id=$5,topic_id=$6,date_delivered=$7,audio_path=$8, slug= $9 WHERE sermon_id = $10"
            
                // Execute SQL statement
                _, err = db.Exec(query, title, script,scriptureId,authorId,seriesId,topicId,t,audioPath,slug, sermonId)
                if err != nil {
                    log.Fatal(err)
                }
            
            doneCh := make(chan struct{})


            defer close(doneCh)

         
            if _, err := w.Write([]byte("Sermon Updated")); err != nil {
                fmt.Fprintf(os.Stderr, "%v\n", err)
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
        }),
    )
}

func DeleteSermonHandler(minioClient *minio.Client,index *search.Index) http.Handler {
    return middleware.EnsureValidToken()(
        http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            fmt.Print("Inside handler function") // New print statement
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
         
            series_id := r.FormValue("id")
			slug:= r.FormValue("slug")

            
            _, err := db.Exec("DELETE FROM series WHERE series_id=$1", series_id)
            if err != nil {
                http.Error(w, "Failed to delete series", http.StatusInternalServerError)
                return
            }
            // Get the prefix for the objects to delete
            prefix := fmt.Sprintf("sermons/series/%s/",slug)

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

