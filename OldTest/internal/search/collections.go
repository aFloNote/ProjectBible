package search

import (
	"context"

	"log"

	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)
func InitializeCollections(client *typesense.Client, schemas []*api.CollectionSchema) {
	for _, schema := range schemas {
		log.Printf("Checking if the '%s' collection exists...\n", schema.Name)
		_, err := client.Collection(schema.Name).Retrieve(context.Background())

		if err != nil {
			log.Printf("The '%s' collection does not exist, creating it...\n", schema.Name)
			_, err := client.Collections().Create(context.Background(), schema)
			if err != nil {
				log.Fatalf("Failed to create the '%s' collection: %v\n", schema.Name, err)
			} else {
				log.Printf("Collection '%s' created successfully\n", schema.Name)
			}
		} else {
			log.Printf("The '%s' collection already exists. No action taken.\n", schema.Name)
		}
	}
}
func InitCollect(client *typesense.Client) {
	schemas := []*api.CollectionSchema{
		{
			Name: "topics",
			Fields: []api.Field{
				{Name: "topic_id", Type: "string"},
				{Name: "name", Type: "string"},
				{Name: "image_path", Type: "string"},
				{Name: "slug", Type: "string"},
			},
		},
		{
			Name: "series",
			Fields: []api.Field{
				{Name: "series_id", Type: "string"},
				{Name: "title", Type: "string"},
				{Name: "description", Type: "string"},
				{Name: "image_path", Type: "string"},
				{Name: "date_published", Type: "string"},
				{Name: "slug", Type: "string"},
				// Add other fields as needed
			},
		},
		{
			Name: "authors",
			Fields: []api.Field{
				{Name: "author_id", Type: "string"},
				{Name: "name", Type: "string"},
				{Name: "ministry", Type: "string"},
				{Name: "image_path", Type: "string"},
				{Name: "bio_link", Type: "string"},
				{Name: "slug", Type: "string"},
				// Add other fields as needed
			},
		},
		{
			Name: "sermons",
			Fields: []api.Field{
				{Name: "sermon_id", Type: "string"},
				{Name: "title", Type: "string"},
				{Name: "description", Type: "string"},
				{Name: "image_path", Type: "string"},
				{Name: "author_id", Type: "string"},
				{Name: "series_id", Type: "string"},
				{Name: "topic_id", Type: "string"},
				{Name: "scripture_id", Type: "string"},
				{Name: "scripture", Type: "string"},
				{Name: "audio_path", Type: "string"},
				{Name: "date_delivered", Type: "string"},
				{Name:"typesense_date", Type:"int64"},
				{Name: "slug", Type: "string"},
				// Add other fields as needed
			},
		},
		{
			Name: "scriptures",
			Fields: []api.Field{
				{Name: "scripture_id", Type: "string"},
				{Name: "book", Type: "string"},
				{Name: "image_path", Type: "string"},
				{Name: "slug", Type: "string"},
				// Add other fields as needed
			},
		},
		{
			Name: "search",
			Fields: []api.Field{
				{Name: "searchid", Type: "string"},
				{Name: "primary", Type: "string"},
				{Name: "secondary", Type: "string"},
				{Name: "theType", Type: "string"},
				{Name: "slug", Type: "string"},
				// Add other fields as needed
			},
		},
		// Add other collection schemas as needed
	}

	// Initialize the collections
	InitializeCollections(client, schemas)
	

}