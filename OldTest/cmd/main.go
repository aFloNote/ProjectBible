package main



import (
	
	"net/http"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
	"github.com/aFloNote/ProjectBible/OldTest/internal/router"
    _"github.com/lib/pq"
	"os"
	"log"
	"fmt"
	
)


func main() {
	
	
    fmt.Println("DB_HOST:", dbHost)
	fileStorage.InitMinio(os.Getenv("STORAGE_ENDPOINT"), os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"))
	db.InitDB()

	// Construct the connecton string
	//db.InsertAuthor()
	r := router.NewRouter()

    http.ListenAndServe(":8080", r)
}
