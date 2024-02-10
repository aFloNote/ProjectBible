package db

import (
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/lib/pq"
)

// DB is a global database connection pool.
var DB *sql.DB

// InitDB initializes the database connection using environment variables.
func InitDB() {
    var err error

    // Construct the connection string
    psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        os.Getenv("DB_HOST"),
        os.Getenv("DB_PORT"),
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_NAME"))
	

    // Open the connection
    DB, err = sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatalf("Error opening database: %v", err)
    }

    // Check the connection
    err = DB.Ping()
    if err != nil {
        log.Fatalf("Error connecting to the database: %v ", err)
    }

    fmt.Println("Successfully connected to the database!")
}
func GetDB() *sql.DB {
    return DB
}