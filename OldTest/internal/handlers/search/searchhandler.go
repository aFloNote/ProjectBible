package handlerSearch

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	
	"strings"

	
	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
	// Import other necessary packages
)

// Author represents the structure of your author data

// AuthorsHandler handles the /api/authors endpoint




func SearchHandler(client *typesense.Client) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        
        fmt.Println("SearchHandler")
        query := r.URL.Query().Get("query")
        if query == "" {
            http.Error(w, "Query parameter is missing", http.StatusBadRequest)
            return
        }

        type SearchResultItem struct {
            Collection string      `json:"collection"`
            Document   interface{} `json:"document"`
        }

        var allResults []SearchResultItem

        collections := map[string][]string{
            "topics":     {"name"},
            "series":     {"title", "desc"}, // Example for multiple fields
            "authors":    {"name","ministry"},
            "sermons":    {"title","scripture","desc"},
            "scriptures": {"book"},
        }

        for collectionName, fields := range collections {
            queryByFields := strings.Join(fields, ",")
            searchResult, err := client.Collection(collectionName).Documents().Search(context.Background(), &api.SearchCollectionParams{
                Q:       query,
                QueryBy: queryByFields,
            })
            if err != nil {
                fmt.Printf("Error searching collection %s: %v\n", collectionName, err)
                continue // Optionally, handle this error more gracefully
            }
            if searchResult.Hits != nil {
                for _, document := range *searchResult.Hits {
                    allResults = append(allResults, SearchResultItem{
                        Collection: collectionName,
                        Document:   document.Document, // Adjust according to the structure of document
                    })
                }
            }
        }

        w.Header().Set("Content-Type", "application/json")
        if err := json.NewEncoder(w).Encode(allResults); err != nil {
            http.Error(w, "Failed to encode results", http.StatusInternalServerError)
            return
        }
    })
}