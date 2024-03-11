// internal/router/router.go
package router

// File: /router/router.go

import (
	
	"log"
	"net/http"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
	"github.com/aFloNote/ProjectBible/OldTest/internal/handlers/sermons"
	"github.com/minio/minio-go/v7"
)





func NewRouter(minio *minio.Client,index *search.Index) *http.ServeMux {
	router := http.NewServeMux()
	router.Handle("/api/pubfetchsermons", handlerSermon.PubFetchSermonHandler())
	router.Handle("/api/fetchsermons", handlerSermon.PubFetchSermonHandler())
	router.Handle("/api/uploadsermon", handlerSermon.AddSermonHandler(minio,index))
	router.Handle("/api/updatesermon", handlerSermon.UpdateSermonHandler(minio,index))
	router.Handle("/api/deletesermon", handlerSermon.DeleteSermonHandler(minio,index))
	
	router.Handle("/api/fetchseries", handlerSermon.FetchSeriesHandler())
	router.Handle("/api/pubfetchseries", handlerSermon.PubFetchSeriesHandler())
	router.Handle("/api/uploadseries", handlerSermon.AddSeriesHandler(minio,index))
	router.Handle("/api/updateseries", handlerSermon.UpdateSeriesHandler(minio,index))
	router.Handle("/api/deleteseries", handlerSermon.DeleteSeriesHandler(minio,index))


	router.Handle("/api/pubfetchauthors", handlerSermon.PubFetchAuthorsHandler())
	router.Handle("/api/fetchauthors", handlerSermon.FetchAuthorsHandler())
	router.Handle("/api/uploadauthor", handlerSermon.AddAuthorsHandler(minio,index))
	router.Handle("/api/updateauthor", handlerSermon.UpdateAuthorsHandler(minio,index))
	router.Handle("/api/deleteauthor", handlerSermon.DeleteAuthorsHandler(minio,index))

	router.Handle("/api/pubfetchtopics", handlerSermon.PubFetchTopicsHandler())
	router.Handle("/api/fetchtopics", handlerSermon.FetchTopicsHandler())
	router.Handle("/api/uploadtopic", handlerSermon.AddTopicsHandler(minio,index))
	router.Handle("/api/updatetopic", handlerSermon.UpdateTopicsHandler(minio,index))
	router.Handle("/api/deletetopic", handlerSermon.DeleteTopicsHandler(minio,index))

	router.Handle("/api/pubfetchscriptures", handlerSermon.PubFetchScripturesHandler())
	router.Handle("/api/fetchscriptures", handlerSermon.FetchScripturesHandler())
	router.Handle("/api/updatescripture", handlerSermon.UpdateScripturesHandler(minio,index))

	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
    return router
}