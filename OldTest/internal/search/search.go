package search

import (
	"context"
	"fmt"
	"log"

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
func DeleteDocument(client *typesense.Client, query string, field string, theType string) {
	idValue := GetDocID(client, query, field, theType)

	response, err := client.Collection(theType).Document(idValue).Delete(context.Background())
	if err != nil {
		// If err is not nil, the deletion failed.
		log.Printf("Failed to delete document with ID %s: %v\n", idValue, err)
	} else {
		// If err is nil, the deletion was successful.
		fmt.Printf("Document with ID %s deleted successfully.\n", idValue)
		// Optionally, inspect the response object for more details about the deletion.
	}
	fmt.Println(response)

}

func UpdateDocument(client *typesense.Client, query string, field string, theType string, newDocument map[string]interface{}) {

    idValue := GetDocID(client, query, field, theType)

    if idValue == "" {
        log.Println("Failed to get document ID.")
        return
    }

    response, err := client.Collection(theType).Document(idValue).Update(context.Background(), newDocument)
    if err != nil {
        log.Printf("Failed to update document with ID %s: %v\n", idValue, err)
    } else {
        fmt.Printf("Document with ID %s update successfully.\n", idValue)
    }
    fmt.Println(response)
}

func GetDocID(client *typesense.Client, query string, field string, theType string) string {
	numHits := 1
	filter := fmt.Sprintf("%s:= '%s'", field, query)
	searchParameters := &api.SearchCollectionParams{
		Q:        query,
		QueryBy:  field,
		FilterBy: &filter,
		PerPage:  &numHits,
	}
	searchResult, err := client.Collection(theType).Documents().Search(context.Background(), searchParameters)
	if err != nil {
		return ""
	}
	idValue := ""
	ok := false
	for _, hit := range *searchResult.Hits {
		fmt.Println(hit.Document)
		idValue, ok = (*hit.Document)["id"].(string)
		if !ok {

		} else {
			fmt.Println("Document ID:", idValue)
		}

	}
	return idValue
}
