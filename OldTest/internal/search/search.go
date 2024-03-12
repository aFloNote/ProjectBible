package search

import (
	"context"
	"fmt"

	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)
func SearchCollection(client *typesense.Client, collectionName string, query string, queryByFields string) ([]interface{}, error) {
   
    searchParameters := &api.SearchCollectionParams{
        Q:       query,
        QueryBy: queryByFields,
    }

    searchResult, err := client.Collection(collectionName).Documents().Search(context.Background(), searchParameters)
    if err != nil {
        return nil, err
    }

    // Convert *[]api.SearchResultHit to []interface{}
    var hits []interface{}
	for _, hit := range *searchResult.Hits {
        hitWithCollection := map[string]interface{}{
            "collection": collectionName,
            "document":   *hit.Document,
        }
        hits = append(hits, hitWithCollection)
    }
	fmt.Println(hits)
    return hits, nil
}