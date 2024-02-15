// internal/router/router.go
package router

// File: /router/router.go

import (
    "net/http"
    "log"

	"github.com/aFloNote/ProjectBible/OldTest/internal/handlers"


)

func NewRouter() *http.ServeMux {
    router := http.NewServeMux()


	router.Handle("/api/fetchauthors", handlers.AuthorsHandler())
	router.Handle("/api/private-scoped", handlers.PrivateScopedHandler())

	log.Print("Server listening on https://localhost")
	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
	

    // Add other routes here

    return router
}