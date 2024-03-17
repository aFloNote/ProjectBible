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
            "series":     {"title"}, // Example for multiple fields
            "authors":    {"name","ministry"},
            "sermons":    {"title","scripture"},
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

func SearchPageHandler(client *typesense.Client) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        
        fmt.Println("SearchHandler")
        query := r.URL.Query().Get("query")
        collection := r.URL.Query().Get("collection")
		fmt.Println("Collection: ",collection)
		fmt.Println("Query: ",query)
        if query == "" || collection == "" {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{})
			return
		}

        type SearchResultItem struct {
            Collection string      `json:"collection"`
            Document   interface{} `json:"document"`
        }

        var allResults []SearchResultItem

        collections := map[string][]string{
            "topics":     {"name"},
            "series":     {"title", "description"}, // Example for multiple fields
            "authors":    {"name","ministry"},
            "sermons":    {"title","scripture","description"},
            "scriptures": {"book"},
        }

        fields, ok := collections[collection]
        if !ok {
            http.Error(w, "Invalid collection", http.StatusBadRequest)
            return
        }

        queryByFields := strings.Join(fields, ",")
        searchResult, err := client.Collection(collection).Documents().Search(context.Background(), &api.SearchCollectionParams{
            Q:       query,
            QueryBy: queryByFields,
        })
        if err != nil {
            fmt.Printf("Error searching collection %s: %v\n", collection, err)
            return
        }
        if searchResult.Hits != nil {
            for _, document := range *searchResult.Hits {
                allResults = append(allResults, SearchResultItem{
                    Collection: collection,
                    Document:   document.Document, // Adjust according to the structure of document
                })
            }
        }
		fmt.Println("All Results: ",allResults)
        w.Header().Set("Content-Type", "application/json")
        if err := json.NewEncoder(w).Encode(allResults); err != nil {
            http.Error(w, "Failed to encode results", http.StatusInternalServerError)
            return
        }
    })
}