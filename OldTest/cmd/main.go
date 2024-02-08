package main

import (
	"fmt"
	"net/http"
  
    _"github.com/lib/pq"
	
)





func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello ff from Raven!")
}

func main() {



// Construct the connecton string


	http.HandleFunc("/", helloHandler)
	http.ListenAndServe(":8080", nil)
}
