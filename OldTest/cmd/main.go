package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	"github.com/aFloNote/ProjectBible/OldTest/internal/router"
	"github.com/aFloNote/ProjectBible/OldTest/internal/search"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"

	_ "github.com/lib/pq"
	"github.com/typesense/typesense-go/typesense"
)
func createTypesenseClient() *typesense.Client {
	var client *typesense.Client
	for {
		client = typesense.NewClient(
			typesense.WithServer("http://typesense:8108"),
			typesense.WithAPIKey(os.Getenv("SEARCH_MOD_API")),
			typesense.WithConnectionTimeout(5*time.Second),
			typesense.WithCircuitBreakerMaxRequests(50),
			typesense.WithCircuitBreakerInterval(2*time.Minute),
			typesense.WithCircuitBreakerTimeout(1*time.Minute),
		)
		//client.Collection("topics").Delete(context.Background())
		//client.Collection("scriptures").Delete(context.Background())
		//client.Collection("sermons").Delete(context.Background())
		//client.Collection("series").Delete(context.Background())
		//client.Collection("authors").Delete(context.Background())
		
		// Attempt a simple operation like fetching the health status
		_, err := client.Health(context.Background(), 10*time.Second)
		if err == nil {
			fmt.Println("Connected to Typesense.")
			break
		}
		fmt.Println("Waiting for Typesense to become available...")
		time.Sleep(5 * time.Second) // Adjust the sleep duration as necessary
	}
	return client
}

func main() {


	client := createTypesenseClient()

    // Assuming Health() method requires context and duration
    isHealthy, err := client.Health(context.Background(), 10*time.Second)
    if err != nil {
        log.Fatalf("Failed to check Typesense server health: %v", err)
    } else if isHealthy {
        fmt.Println("Typesense server is healthy.")
    } else {
        fmt.Println("Typesense server might not be healthy.")
    }

	// If no error, print the health status
	fmt.Printf("Typesense server health: %+v\n", isHealthy)
	search.InitCollect(client)
	db.InitDB()
	minioClient:=fileStorage.InitMinio(os.Getenv("STORAGE_ENDPOINT"), os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"))
	mux := router.NewRouter(minioClient,client)
	
	log.Println("Listening on :8080")
   if err := http.ListenAndServe(":8080", mux); err != nil {
	   log.Fatalf("There was an error with the http server: %v", err)
   }
	
	//db.InsertAuthor()

   
	
	
}
