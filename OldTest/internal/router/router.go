// internal/router/router.go
package router

// File: /router/router.go

import (
	
	"log"
	"net/http"

	"github.com/aFloNote/ProjectBible/OldTest/internal/handlers/sermons"
	"github.com/minio/minio-go/v7"
)





func NewRouter(minio *minio.Client) *http.ServeMux {
	router := http.NewServeMux()
	router.Handle("/api/pubfetchsermons", handlerSermon.PubFetchSermonHandler())
	router.Handle("/api/fetchauthors", handlerSermon.FetchAuthorsHandler())
	router.Handle("/api/fetchseries", handlerSermon.FetchSeriesHandler())
	router.Handle("/api/uploadauthor", handlerSermon.AddAuthorsHandler(minio))
	router.Handle("/api/uploadseries", handlerSermon.AddSeriesHandler(minio))
	router.Handle("/api/uploadsermon", handlerSermon.AddSermonHandler(minio))
	
	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
    return router
}