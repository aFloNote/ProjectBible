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
	router.Handle("/api/fetchsermons", handlerSermon.PubFetchSermonHandler())
	router.Handle("/api/uploadsermon", handlerSermon.AddSermonHandler(minio))
	
	router.Handle("/api/fetchseries", handlerSermon.FetchSeriesHandler())
	router.Handle("/api/pubfetchseries", handlerSermon.PubFetchSeriesHandler())
	router.Handle("/api/uploadseries", handlerSermon.AddSeriesHandler(minio))
	router.Handle("/api/updateseries", handlerSermon.UpdateSeriesHandler(minio))
	router.Handle("/api/deleteseries", handlerSermon.DeleteSeriesHandler(minio))


	router.Handle("/api/pubfetchauthors", handlerSermon.PubFetchAuthorsHandler())
	router.Handle("/api/fetchauthors", handlerSermon.FetchAuthorsHandler())
	router.Handle("/api/uploadauthor", handlerSermon.AddAuthorsHandler(minio))
	router.Handle("/api/updateauthor", handlerSermon.UpdateAuthorsHandler(minio))
	router.Handle("/api/deleteauthor", handlerSermon.DeleteAuthorsHandler(minio))

	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
    return router
}