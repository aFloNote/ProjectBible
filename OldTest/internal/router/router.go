// internal/router/router.go
package router

// File: /router/router.go

import (
    "net/http"
    "log"
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	_ "github.com/lib/pq"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
  
)

func NewRouter() *http.ServeMux {
    router := http.NewServeMux()

	// This route is always accessible.
	router.Handle("/api/public", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Hello from a public endpoint! You don't need to be authenticated to see this."}`))
	}))

	// This route is only accessible if the user has a valid access_token.
	router.Handle("/api/private", middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", "https://localhost/admin")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"message":"Hello from a private endpoint! You need to be authenticated to see this."}`))
		}),
	))

	log.Print("Server listening on https://localhost")
	if err := http.ListenAndServe("0.0.0.0:8080", router); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
	router.Handle("/api/private-scoped", middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", "https://localhost")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")

			w.Header().Set("Content-Type", "application/json")

			token := r.Context().Value(jwtmiddleware.ContextKey{}).(*validator.ValidatedClaims)

			claims := token.CustomClaims.(*middleware.CustomClaims)
			if !claims.HasScope("read:messages") {
				w.WriteHeader(http.StatusForbidden)
				w.Write([]byte(`{"message":"Insufficient scope."}`))
				return
			}

			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"message":"Hello from a private endpoint! You need to be authenticated to see this."}`))
		}),
	))

    // Add other routes here

    return router
}