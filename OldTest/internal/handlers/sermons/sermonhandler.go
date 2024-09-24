package handlerSermon

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

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
	"github.com/typesense/typesense-go/typesense/api"
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
	topicSlug := params.Get("topic_slug")
	topicSlugArray := strings.Split(topicSlug, ",")
	fmt.Println("Topic slug array: ", topicSlugArray)
	scriptureSlug := params.Get("script_slug")
	// Start building the SQL query
	query := `
    SELECT 
        sermons.sermon_id, sermons.title, sermons.date_delivered, sermons.scripture, sermons.audio_path, sermons.series_id, sermons.author_id,sermons.scripture_id, sermons.slug,sermons.note_path,
        authors.author_id, authors.name, authors.ministry, authors.image_path, authors.slug,
        series.series_id, series.title, series.description, series.image_path, series.date_published, series.slug,
        json_agg(topics) as topics,
        scriptures.scripture_id, scriptures.book,scriptures.image_path, scriptures.slug
    FROM 
        sermons
    INNER JOIN 
        authors ON sermons.author_id = authors.author_id
    INNER JOIN 
        series ON sermons.series_id = series.series_id
    INNER JOIN 
        topics ON   topics.topic_id=ANY(sermons.topic_id)
    INNER JOIN 
        scriptures ON sermons.scripture_id = scriptures.scripture_id
	
    `

	// If a sermon ID was provided, add a WHERE clause to the query

	var err error
	var rows *sql.Rows
	var param string
	if sermonID != "" {
		query += "WHERE sermons.slug = $1 "
		param = sermonID
	} else if authorSlug != "" {
		query += "WHERE authors.slug = $1 "
		param = authorSlug
	} else if seriesSlug != "" {
		query += "WHERE series.slug = $1 "
		param = seriesSlug
	} else if topicSlug != "" {
		query += "WHERE topics.slug = $1 "
		param = topicSlug
	} else if scriptureSlug != "" {
		query += "WHERE scriptures.slug = $1 "
		param = scriptureSlug
	
	} 
	
	query += "GROUP BY sermons.sermon_id, authors.author_id, series.series_id, scriptures.scripture_id "
	query += "ORDER BY sermons.date_delivered DESC"
	if param != "" {
		rows, err = db.Query(query, param)
	} else {
		rows, err = db.Query(query)
	}
	
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error querying the database for Sermons: %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	

	// Execute the query

	defer rows.Close()

	sermons := []types.SermonFull{}

	for rows.Next() {
		var sermon types.SermonType
		var author types.AuthorType
		var series types.SeriesType
		var scripture types.ScriptureType
		var topics []types.TopicType
		var topicsJSON []byte
err := rows.Scan(
    &sermon.SermonID, &sermon.Title, &sermon.DateDelivered, &sermon.Scripture, &sermon.Audio_Path, &sermon.SeriesID, &sermon.AuthorID, &sermon.ScriptureID,&sermon.Slug, &sermon.Note_Path,
    &author.AuthorID, &author.Name, &author.Ministry, &author.Image_Path, &author.Slug,
    &series.SeriesID, &series.Title, &series.Description, &series.Image_Path, &series.Date_Published, &series.Slug,
    &topicsJSON,
    &scripture.ScriptureID, &scripture.Book, &scripture.Image_Path, &scripture.Slug,
)
if err != nil {
    fmt.Fprintf(os.Stderr, "Process Sermons error: %v\n", err)
    w.Write([]byte(`{""Failed to process series_id: " + err.Error()"}`))
}

err = json.Unmarshal(topicsJSON, &topics)
if err != nil {
    fmt.Fprintf(os.Stderr, "Failed to unmarshal topics: %v\n", err)
    w.Write([]byte(`{"Failed to unmarshal topics: " + err.Error()}`))
}

		sermons = append(sermons, types.SermonFull{
			SermonType:    sermon,
			AuthorType:    author,
			SeriesType:    series,
			TopicType:     topics,
			ScriptureType: scripture,
		})
	}
	fmt.Println("Sermons: ", sermons)
	// Check for errors from iterating over rows.
	if err = rows.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "Error getting rows: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Encode the authors slice to JSON and write it to the response
	if err = json.NewEncoder(w).Encode(sermons); err != nil {
		fmt.Fprintf(os.Stderr, "Error encorder: %v", err)
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

func AddSermonHandler(minioClient *minio.Client, client *typesense.Client) http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")
			w.Header().Set("Content-Type", "text/plain") // Change this to text/plain

			fileAudio, headerAudio, contentType, err := fileStorage.ParseFile(r, 10<<20, "audio") // Use the actual form field name
			if err != nil {
				fmt.Fprintf(os.Stderr, "Process fil error: %v\n", err)
				w.Write([]byte(`{""Failed to process uploaded file: " + err.Error()"}`))

				return
			}
			defer fileAudio.Close()

			// Get form data
			title := r.FormValue("title")
			scripture := r.FormValue("scripture")
			seriesid := r.FormValue("series_id")
			authid := r.FormValue("author_id")
			topicid := r.FormValue("topic_id")
			topicIDStr := fmt.Sprintf("{%s}", topicid)

			scriptid := r.FormValue("scripture_id")

			sermonID := uuid.New()
			slugTitle := slug.Make(title)

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
			fmt.Printf("Size: %v, Content Type: %s\n", headerAudio.Size, contentType)
			audioPath := fmt.Sprintf("sermons/sermons/%s/audio/%s", slugTitle, headerAudio.Filename)
			// Start the timer

			// Upload the file
			fmt.Println("Title before database query: ", seriesid)
			upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), audioPath, fileAudio, headerAudio.Size, minio.PutObjectOptions{ContentType: contentType})

			// Stop the timer

			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to upload file to MinIO. Upload info: %+v, Error: %v\n", upLoadInfo, err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Attempt to insert author information into the database
			fmt.Println("Title before database query: ", seriesid)
			query := "INSERT INTO sermons (sermon_id,title, date_delivered, audio_path, series_id, author_id, scripture, scripture_id,topic_id, slug) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10)"
			_, err = db.Exec(query, sermonID, title, t, audioPath, seriesid, authid, scripture, scriptid, topicIDStr, slugTitle) // Note: Using path as MinIO doesn't return a URL in uploadInfo
			if err != nil {
				// If the query fails, attempt to remove the uploaded file from MinIO
				errRemove := minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), audioPath, minio.RemoveObjectOptions{})
				if errRemove != nil {
					// Log or handle the error occurred during file removal

					fmt.Fprintf(os.Stderr, "Failed to remove uploaded file after DB error: %v\n", errRemove)
				}

				// Return or handle the original database error

				http.Error(w, "Failed to insert author into database: "+err.Error(), http.StatusInternalServerError)
				return
			}

			type SermonTypeForTypesense struct {
				SermonID      string `json:"sermon_id"`
				Scripture     string `json:"scripture"`
				SeriesID      string `json:"series_id"`
				AuthorID      string `json:"author_id"`
				TopicID       string `json:"topic_id"`
				ScriptureID   string `json:"scripture_id"`
				DateDelivered string `json:"date_delivered"`
				TypesenseDate int64  `json:"typesense_date"`
				Title         string `json:"title"`
				Description   string `json:"description"`
				Image_Path    string `json:"image_path"`
				Audio_Path    string `json:"audio_path"`
				Slug          string `json:"slug"`
			}
			sermonDocument := types.SermonType{
				SermonID:      sermonID.String(),
				Scripture:     scripture,
				SeriesID:      seriesid,
				AuthorID:      authid,
				TopicID:       topicIDStr,
				ScriptureID:   scriptid,
				DateDelivered: t,
				TypesenseDate: t.Unix(),
				Title:         title,
				Description:   "",
				Audio_Path:    audioPath,
				Image_Path:    "",
				Slug:          slugTitle,
			}
			formattedDateDel := sermonDocument.DateDelivered.Format(time.RFC3339)
			documentForTypesense := SermonTypeForTypesense{
				SermonID:      sermonDocument.SermonID,
				Scripture:     sermonDocument.Scripture,
				SeriesID:      sermonDocument.SeriesID,
				AuthorID:      sermonDocument.AuthorID,
				TopicID:       sermonDocument.TopicID,
				ScriptureID:   sermonDocument.ScriptureID,
				DateDelivered: formattedDateDel,
				TypesenseDate: sermonDocument.TypesenseDate,
				Title:         sermonDocument.Title,
				Description:   sermonDocument.Description,
				Audio_Path:    sermonDocument.Audio_Path,
				Image_Path:    sermonDocument.Image_Path,
				Slug:          sermonDocument.Slug,
			}

			_, err = client.Collection("sermons").Documents().Create(context.Background(), documentForTypesense)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

				http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
				return
			}
			rows := db.QueryRow("SELECT book, image_path FROM scriptures WHERE scripture_id=$1", scriptid)
			var book string
			var bookPath string
			err = rows.Scan(&book, &bookPath)

			if err != nil {
				fmt.Fprintf(os.Stderr, "Error scanning row: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			searchDocument := types.SearchType{
				ID:        sermonID.String(),
				Primary:   title,
				TheType:   "sermon",
				Secondary: scripture,
				Slug:      slugTitle,
			}
			_, err = client.Collection("search").Documents().Create(context.Background(), searchDocument)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

				http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
				return
			}
			searchResult, err := client.Collection("scriptures").Documents().Search(context.Background(), &api.SearchCollectionParams{
				Q:       scriptid,
				QueryBy: "scripture_id",
			})
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error searching scriptures: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if searchResult.Hits != nil && len(*searchResult.Hits) == 0 {
				row := db.QueryRow("SELECT scripture_id,book,image_path,slug FROM scriptures WHERE scripture_id=$1", scriptid)
				var scriptid string
				var book string
				var imagePath string
				var slug string
				err := row.Scan(&scriptid, &book, &imagePath, &slug)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Could not get scripture id from db: %v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				scriptDocument := types.ScriptureType{
					ScriptureID: scriptid,
					Book:        book,
					Image_Path:  imagePath,
					Slug:        slug,
				}

				_, err = client.Collection("scriptures").Documents().Create(context.Background(), scriptDocument)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

					http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
					return
				}
				searchDocument := types.SearchType{
					ID:        scriptid,
					Primary:   book,
					TheType:   "scripture",
					Secondary: "",
					Slug:      slug,
				}
				_, err = client.Collection("search").Documents().Create(context.Background(), searchDocument)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

					http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
					return
				}

				if _, err := w.Write([]byte("Sermon Added")); err != nil {
					fmt.Fprintf(os.Stderr, "%v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			}
		}),
	)
}

func UpdateSermonHandler(minioClient *minio.Client, client *typesense.Client) http.Handler {
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
			topicIDStr := fmt.Sprintf("{%s}", topicId)
			scriptureId := r.FormValue("scripture_id")

			row := db.QueryRow("SELECT scripture_id FROM sermons WHERE sermon_id=$1", sermonId)
			var scriptureIdFromDb string
			err := row.Scan(&scriptureIdFromDb)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Could not get scripture id from db: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if scriptureIdFromDb != scriptureId {
				rows, err := db.Query("SELECT sermon_id FROM sermons WHERE scripture_id=$1", scriptureIdFromDb)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Could not get any sermons with scripture_id: %v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}
				defer rows.Close()

				foundCount := 0
				for rows.Next() {
					foundCount++
				}
				fmt.Println("Found count: ", foundCount)
				if err := rows.Err(); err != nil {
					fmt.Fprintf(os.Stderr, "Error Scanning rows.next line 422: %v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}

				if foundCount == 1 {
					search.DeleteDocument(client, scriptureIdFromDb, "scripture_id", "scriptures")
					search.DeleteDocument(client, scriptureIdFromDb, "searchid", "search")
				}
				searchResult, err := client.Collection("scriptures").Documents().Search(context.Background(), &api.SearchCollectionParams{
					Q:       scriptureId,
					QueryBy: "scripture_id",
				})
				if err != nil {
					fmt.Fprintf(os.Stderr, "Error searching scriptures: %v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
				if searchResult.Hits != nil && len(*searchResult.Hits) == 0 {
					row := db.QueryRow("SELECT scripture_id,book,image_path,slug FROM scriptures WHERE scripture_id=$1", scriptureId)
					var scriptid string
					var book string
					var imagePath string
					var slug string
					err := row.Scan(&scriptid, &book, &imagePath, &slug)
					if err != nil {
						fmt.Fprintf(os.Stderr, "Could not get scripture id from db: %v\n", err)
						http.Error(w, err.Error(), http.StatusInternalServerError)
						return
					}

					scriptDocument := types.ScriptureType{
						ScriptureID: scriptid,
						Book:        book,
						Image_Path:  imagePath,
						Slug:        slug,
					}

					_, err = client.Collection("scriptures").Documents().Create(context.Background(), scriptDocument)
					if err != nil {
						fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

						http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
						return
					}
					searchDocument := types.SearchType{
						ID:        scriptid,
						Primary:   book,
						TheType:   "scripture",
						Secondary: "",
						Slug:      slug,
					}
					_, err = client.Collection("search").Documents().Create(context.Background(), searchDocument)
					if err != nil {
						fmt.Fprintf(os.Stderr, "Failed to index topic in Typesense: %v\n", err)

						http.Error(w, "Failed to index topic in Typesense: "+err.Error(), http.StatusInternalServerError)
						return
					}
				}
			}

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

			audioPath, err := fileStorage.ProcessPathFiles(minioClient, "sermon", "audio", r, slug)
			if err != nil {
				fmt.Fprintf(os.Stderr, "upload file error: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return

			}
			query := "UPDATE sermons SET title = $1, scripture = $2, scripture_id=$3, author_id=$4,series_id=$5,topic_id=$6,date_delivered=$7,audio_path=$8, slug= $9 WHERE sermon_id = $10"

			// Execute SQL statement
			_, err = db.Exec(query, title, script, scriptureId, authorId, seriesId, topicIDStr, t, audioPath, slug, sermonId)
			if err != nil {
				log.Fatal(err)
			}

			doneCh := make(chan struct{})

			defer close(doneCh)

			updateData := map[string]interface{}{
				"'sermon_id":     sermonId,
				"title":          title,
				"scripture":      script,
				"scripture_id":   scriptureId,
				"author_id":      authorId,
				"series_id":      seriesId,
				"date_delivered": t.Format(time.RFC3339),
				"typesense_date": t.Unix(),
				"topic_id":       topicIDStr,
				"audio_path":     audioPath,
				"slug":           slug,
			}
			fmt.Println("Update data: ", t.Unix(), t.Format(time.RFC3339))
			search.UpdateDocument(client, sermonId, "sermon_id", "sermons", updateData)
			updateSearch := map[string]interface{}{
				"id":        sermonId,
				"primary":   title,
				"secondary": script,
				"slug":      slug,
			}
			search.UpdateDocument(client, sermonId, "id", "search", updateSearch)

			if _, err := w.Write([]byte("Sermon Updated")); err != nil {
				fmt.Fprintf(os.Stderr, "%v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}),
	)
}

func DeleteSermonHandler(minioClient *minio.Client, client *typesense.Client) http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			fmt.Print("Inside handler function") // New print statement
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")
			w.Header().Set("Content-Type", "text/plain")

			sermon_id := r.FormValue("id")
			slug := r.FormValue("slug")
			scriptureId := r.FormValue("scripture_id")
			row := db.QueryRow("SELECT scripture_id FROM sermons WHERE sermon_id=$1", sermon_id)
			var scriptureIdFromDb string
			err := row.Scan(&scriptureIdFromDb)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Could not get scripture id from db: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if scriptureIdFromDb != scriptureId {
				rows, err := db.Query("SELECT sermon_id FROM sermons WHERE scripture_id=$1", scriptureIdFromDb)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Could not get any sermons with scripture_id: %v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}
				defer rows.Close()

				foundCount := 0
				for rows.Next() {
					foundCount++
				}

				if err := rows.Err(); err != nil {
					fmt.Fprintf(os.Stderr, "Error Scanning rows.next line 422: %v\n", err)
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}

				if foundCount == 1 {
					search.DeleteDocument(client, scriptureIdFromDb, "scripture_id", "scriptures")
					search.DeleteDocument(client, scriptureIdFromDb, "searchid", "search")
				}

			}

			_, err = db.Exec("DELETE FROM sermons WHERE sermon_id=$1", sermon_id)
			if err != nil {
				http.Error(w, "Failed to delete series", http.StatusInternalServerError)
				return
			}
			// Get the prefix for the objects to delete
			prefix := fmt.Sprintf("sermons/sermons/%s/", slug)
			fmt.Println(slug)
			fmt.Println(sermon_id)
			fmt.Println("prefix")
			
			fmt.Println(prefix)
			for object := range minioClient.ListObjects(context.Background(), os.Getenv("STORAGE_BUCKET"), minio.ListObjectsOptions{Prefix: prefix, Recursive: true}) {
				fmt.Println(object.Key)
				if object.Err != nil {
					fmt.Fprintf(os.Stderr, "Error listing objects for deletion: %v\n", object.Err)
					return
				}

				errRemove := minioClient.RemoveObject(context.Background(), "FaithBiblePub", object.Key, minio.RemoveObjectOptions{})
				if errRemove != nil {
					fmt.Fprintf(os.Stderr, "Failed to remove object: %v\n", errRemove)
				}
			}
			search.DeleteDocument(client, sermon_id, "sermon_id", "sermons")
			search.DeleteDocument(client, sermon_id, "searchid", "search")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("Series deleted successfully"))
		}),
	)
}
