package main



import (
	"fmt"
	"net/http"
	"github.com/aFloNote/ProjectBible/OldTest/internal/storage"
	"github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
    _"github.com/lib/pq"
	"os"
	
)


func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello ff from Raven!")
}

func main() {
	fileStorage.InitMinio(os.Getenv("STORAGE_ENDPOINT"), os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"))
	db.InitDB()

	// Construct the connecton string
	db.InsertAuthor()
	http.HandleFunc("/", helloHandler)
	http.ListenAndServe(":8080", nil)
}
