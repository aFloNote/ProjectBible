package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/aFloNote/ProjectBible/OldTest/internal/middleware"
	// Import other necessary packages
)

// Author represents the structure of your author data
type Author struct {
	AuthorID   int    `json:"author_id"`
	Name       string `json:"name"`
	Ministry   string `json:"ministry"`
	ImagePath  string `json:"image_path"`
}

// AuthorsHandler handles the /api/authors endpoint
func AuthorsHandler() http.Handler {
	return middleware.EnsureValidToken()(
		http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// CORS Headers.
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", "https://localhost/admin")
			w.Header().Set("Access-Control-Allow-Headers", "Authorization")
			w.Header().Set("Content-Type", "application/json")

			// Simulated author data
			authors := []Author{
				{
					AuthorID:   1,
					Name:       "John Doe",
					Ministry:   "Global Outreach",
					ImagePath:  "path/to/image1.jpg",
				},
				{
					AuthorID:   2,
					Name:       "Jane Smith",
					Ministry:   "Local Missions",
					ImagePath:  "path/to/image2.jpg",
				},
			}

			// Encode the authors slice to JSON and write it to the response
			if err := json.NewEncoder(w).Encode(authors); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}),
	)
}