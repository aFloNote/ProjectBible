package main

import (
	"log"
	"net/http"
	"os"

	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"

	"github.com/aFloNote/ProjectBible/OldTest/internal/router"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
	_ "github.com/lib/pq"
)


func main() {
	client := search.NewClient("VWKG4W93Z4", os.Getenv("SEARCH_ADMIN"))

  
  	index := client.InitIndex("faith_index")
	db.InitDB()
	minioClient:=fileStorage.InitMinio(os.Getenv("STORAGE_ENDPOINT"), os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"))
	mux := router.NewRouter(minioClient,index)
	
	log.Println("Listening on :8080")
   if err := http.ListenAndServe(":8080", mux); err != nil {
	   log.Fatalf("There was an error with the http server: %v", err)
   }
	
	//db.InsertAuthor()

   
	
	
}
