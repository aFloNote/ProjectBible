// internal/router/router.go
package router

// File: /router/router.go

import (
	
	"log"
	"net/http"
	"github.com/typesense/typesense-go/typesense"
	"github.com/aFloNote/ProjectBible/OldTest/internal/handlers/sermons"
	"github.com/aFloNote/ProjectBible/OldTest/internal/handlers/search"
	"github.com/minio/minio-go/v7"
)





func NewRouter(minio *minio.Client,typesense *typesense.Client) *http.ServeMux {
	router := http.NewServeMux()
	router.Handle("/api/pubfetchsermons", handlerSermon.PubFetchSermonHandler())
	router.Handle("/api/fetchsermons", handlerSermon.PubFetchSermonHandler())
	router.Handle("/api/uploadsermon", handlerSermon.AddSermonHandler(minio,typesense))
	router.Handle("/api/updatesermon", handlerSermon.UpdateSermonHandler(minio,typesense))
	router.Handle("/api/deletesermon", handlerSermon.DeleteSermonHandler(minio,typesense))
	
	router.Handle("/api/fetchseries", handlerSermon.FetchSeriesHandler())
	router.Handle("/api/pubfetchseries", handlerSermon.PubFetchSeriesHandler())
	router.Handle("/api/uploadseries", handlerSermon.AddSeriesHandler(minio,typesense))
	router.Handle("/api/updateseries", handlerSermon.UpdateSeriesHandler(minio,typesense))
	router.Handle("/api/deleteseries", handlerSermon.DeleteSeriesHandler(minio,typesense))


	router.Handle("/api/pubfetchauthors", handlerSermon.PubFetchAuthorsHandler())
	router.Handle("/api/fetchauthors", handlerSermon.FetchAuthorsHandler())
	router.Handle("/api/uploadauthor", handlerSermon.AddAuthorsHandler(minio,typesense))
	router.Handle("/api/updateauthor", handlerSermon.UpdateAuthorsHandler(minio,typesense))
	router.Handle("/api/deleteauthor", handlerSermon.DeleteAuthorsHandler(minio,typesense))

	router.Handle("/api/pubfetchtopics", handlerSermon.PubFetchTopicsHandler())
	router.Handle("/api/fetchtopics", handlerSermon.FetchTopicsHandler())
	router.Handle("/api/uploadtopic", handlerSermon.AddTopicsHandler(minio,typesense))
	router.Handle("/api/updatetopic", handlerSermon.UpdateTopicsHandler(minio,typesense))
	router.Handle("/api/deletetopic", handlerSermon.DeleteTopicsHandler(minio,typesense))

	router.Handle("/api/pubfetchscriptures", handlerSermon.PubFetchScripturesHandler())
	router.Handle("/api/fetchscriptures", handlerSermon.FetchScripturesHandler())
	router.Handle("/api/updatescripture", handlerSermon.UpdateScripturesHandler(minio,typesense))

	router.Handle("/api/fetchsearch", handlerSearch.SearchHandler(typesense))
	router.Handle("/api/fetchsearchpage", handlerSearch.SearchPageHandler(typesense))

	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
    return router
}