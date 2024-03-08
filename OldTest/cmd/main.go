package main

import (
	"log"
	"net/http"
	"os"

	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"

	"github.com/aFloNote/ProjectBible/OldTest/internal/router"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"

	_ "github.com/lib/pq"
)


func main() {
	
	db.InitDB()
	minioClient:=fileStorage.InitMinio(os.Getenv("STORAGE_ENDPOINT"), os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"))
	mux := router.NewRouter(minioClient)
	
	log.Println("Listening on :8080")
   if err := http.ListenAndServe(":8080", mux); err != nil {
	   log.Fatalf("There was an error with the http server: %v", err)
   }
	
	//db.InsertAuthor()

   
	
	
}
