package db

import (
    "context"
    "database/sql"
    "github.com/minio/minio-go/v7"
    "os"
    "fmt"
  
	"net/http"
    "time"
)

func InsertAuthor(db *sql.DB, minioClient *minio.Client, name string, ministry string, imagePath string) error {
    
    
    // Open the image file
    imageFile, err := os.Open(imagePath)
    if err != nil {
        return err
    }
    defer imageFile.Close()

	// Read the first 512 bytes to determine the file type
	buffer := make([]byte, 512)
	_, err = imageFile.Read(buffer)
	if err != nil {
		return err
	}

	// Reset the read pointer to the start of the file
	_, err = imageFile.Seek(0, 0)
	if err != nil {
		return err
	}

	// Determine the file type
	fileType := http.DetectContentType(buffer)
	if fileType != "image/jpeg" && fileType != "image/jpg" && fileType != "image/png" && fileType != "image/gif" {
		return fmt.Errorf("invalid file type: %s", fileType)
	}	

    // Get the size of the file
    fileInfo, err := imageFile.Stat()
    if err != nil {
        return err
    }
    fileSize := fileInfo.Size()

    bucketName := "FaithBible" // Replace with your actual bucket name
    storagePath := "authors/" + name + "/Image" // Replace with your actual object path

    // Upload the image to the bucket
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
    defer cancel()

    _, err = minioClient.PutObject(ctx, bucketName, storagePath, imageFile, fileSize, minio.PutObjectOptions{ContentType: "application/octet-stream"})
    if err != nil {
        return err
    }
    // Start a new transaction
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    // Insert the author into the database
    _, err = tx.Exec("INSERT INTO tablename (name, ministry,image_path) VALUES ($1, $2, $3)", name, ministry,storagePath)
    if err != nil {
        tx.Rollback()
		errDelete := minioClient.RemoveObject(ctx, bucketName, storagePath, minio.RemoveObjectOptions{})
        if errDelete != nil {
            return fmt.Errorf("database error: %v, deletion error: %v", err, errDelete)
        }
    }

    // If everything went well, commit the transaction
    err = tx.Commit()
    if err != nil {
        return err
    }

    return nil
}