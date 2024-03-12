package handlerSearch

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/aFloNote/ProjectBible/OldTest/internal/search"
	"github.com/typesense/typesense-go/typesense"
	// Import other necessary packages
)

// Author represents the structure of your author data

// AuthorsHandler handles the /api/authors endpoint


func SearchHandler(client *typesense.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
   
			fmt.Println("SearchHandler")
            w.Header().Set("Access-Control-Allow-Credentials", "true")
            w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ALLOWED_ORIGIN"))
            w.Header().Set("Access-Control-Allow-Headers", "Authorization")
            w.Header().Set("Content-Type", "text/plain")
			query := r.URL.Query().Get("query")
			if query == "" {
				http.Error(w, "Query parameter is missing", http.StatusBadRequest)
				return
			}
			
           results,err:=search.SearchCollection(client, "topics", query, "name")
		   if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
			}
			json.NewEncoder(w).Encode(results) 
            w.WriteHeader(http.StatusOK)
      
        })
    
}