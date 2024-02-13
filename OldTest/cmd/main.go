package main

import (
	"os"
	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"

	"github.com/aFloNote/ProjectBible/OldTest/internal/router"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"

	_ "github.com/lib/pq"
)


func main() {
	
   
	fileStorage.InitMinio(os.Getenv("STORAGE_ENDPOINT"), os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"))
	db.InitDB()
	router.NewRouter()
	
	//db.InsertAuthor()

   
	
	
}
