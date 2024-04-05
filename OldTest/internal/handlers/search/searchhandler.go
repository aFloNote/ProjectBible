package handlerSearch

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

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
		
		var allResults []interface{}
		
		collectionName := "search"
		queryByFields := "primary,secondary"
		
		searchResult, err := client.Collection(collectionName).Documents().Search(context.Background(), &api.SearchCollectionParams{
			Q:       query,
			QueryBy: queryByFields,
		})
		if err != nil {
			fmt.Printf("Error searching collection %s: %v\n", collectionName, err)
			return // Optionally, handle this error more gracefully
		}
		if searchResult.Hits != nil {
			for _, document := range *searchResult.Hits {
				allResults = append(allResults, document.Document) // Append only the document
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
		fromDate:= r.URL.Query().Get("fromDate")
		toDate:= r.URL.Query().Get("toDate")
		fmt.Println("FromDate: ",fromDate)
		fmt.Println("ToDate: ",toDate)
		fmt.Println("Collection: ",collection)
		fmt.Println("Query: ",query)
        if (query == "" && toDate=="")|| collection == "" {
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
            "sermons":    {"title","scripture"},
            "scriptures": {"book"},
        }

        fields, ok := collections[collection]
        if !ok {
            http.Error(w, "Invalid collection", http.StatusBadRequest)
            return
        }
		if fromDate == "" || fromDate == "undefined" {
			fromDate = fmt.Sprintf("%d", time.Date(2023, 11, 1, 0, 0, 0, 0, time.UTC).Unix())
		} else {
			fromDateInt, err := strconv.ParseInt(fromDate, 10, 64)
			if err != nil {
				http.Error(w, "Invalid fromDate", http.StatusBadRequest)
				return
			}
			// Subtract one day from fromDate
			fromDate = fmt.Sprintf("%d", fromDateInt-86400)
		}
		
		if toDate == "" || toDate == "undefined" {
			toDate = fmt.Sprintf("%d", time.Now().AddDate(0, 0, 1).Unix())
		} else {
			toDateInt, err := strconv.ParseInt(toDate, 10, 64)
			if err != nil {
				http.Error(w, "Invalid toDate", http.StatusBadRequest)
				return
			}
			// Add one day to toDate
			toDate = fmt.Sprintf("%d", toDateInt+86400)
		}

        // Create the filter string
		fmt.Println("FromDate: ",fromDate)
		fmt.Println("ToDate: ",toDate)
		filterBy :=""
		if collection=="sermons" {
        filterBy = fmt.Sprintf("typesense_date:>=%s && typesense_date:<=%s", fromDate, toDate)
		//FilterBy: &filterBy,
		}
        queryByFields := strings.Join(fields, ",")
		searchResult, err := client.Collection(collection).Documents().Search(context.Background(), &api.SearchCollectionParams{
            Q:        query,
            QueryBy:  queryByFields,
            FilterBy: &filterBy,
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