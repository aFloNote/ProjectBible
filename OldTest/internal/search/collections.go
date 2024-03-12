package search

import (
	"context"
	"fmt"
	"log"

	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

func InitCollect(client *typesense.Client) {
	fmt.Println("Checking if the 'topics' collection exists...")
	_, err := client.Collection("topics").Retrieve(context.Background())
	
	if err != nil {
		log.Println("The 'topics' collection does not exist, creating it...")
		schema := &api.CollectionSchema{
			Name: "topics",
			Fields: []api.Field{
				{
					Name: "topic_id",
					Type: "string",
				},
				{
					Name: "name",
					Type: "string",
				},
				{
					Name: "image_path",
					Type: "string",
				},
				{
					Name: "slug",
					Type: "string",
				},
			},
		}

		_, err := client.Collections().Create(context.Background(), schema)
		if err != nil {
			log.Fatalf("Failed to create the 'topics' collection: %s", err)
		} else {
			log.Println("Collection created successfully")
		}
	} else {
		log.Println("The 'topics' collection already exists. No action taken.")
	}
}