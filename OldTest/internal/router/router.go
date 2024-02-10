// internal/router/router.go
package router

import (
    "github.com/go-chi/chi/v5"
    "github.com/aFloNote/ProjectBible/OldTest/internal/handlers"
    
    "github.com/rs/cors"
)

func NewRouter() *chi.Mux {
    r := chi.NewRouter()
     // Set up CORS
     cors := cors.New(cors.Options{
        AllowedOrigins:   []string{"*"}, // Allow all origins
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
        ExposedHeaders:   []string{"Link"},
        AllowCredentials: true,
        MaxAge:           300, // Maximum age for preflight requests
    })

    // Use the CORS middleware
    r.Use(cors.Handler)
    r.Get("/login", handlers.HelloHandler)

    return r
}