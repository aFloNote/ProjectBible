package fileStorage

import (
	
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// InitializeMinioClient sets up the MinIO client for Backblaze B2 bucket operations.
func InitMinio(endpoint, accessKeyID, secretAccessKey string) *minio.Client {
	minio, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(os.Getenv("STORAGE_ACCESS_KEY"), os.Getenv("STORAGE_SECRET_KEY"), ""),
		Secure: true,
	})
	if err != nil {
		log.Fatalf("Failed to initialize MinIO client: %v", err)
	}

	// Optional: List buckets to verify connection
	
	return minio
}

// listBuckets is a helper function to list and log all bucket names. It verifies the MinIO client is connected.


func ParseFile(r *http.Request, maxMemory int64, formFileName string) (multipart.File, *multipart.FileHeader, string, error) {
    // Parse the multipart form with the specified max memory limit
    if err := r.ParseMultipartForm(maxMemory); err != nil {
        return nil, nil, "",err
    }

    // Retrieve the file from the form data
    file, header, err := r.FormFile(formFileName)
    if err != nil {
        return nil, nil, "", err
    }

    // Determine the content type, defaulting to "application/octet-stream" if not found
    contentType := header.Header.Get("Content-Type")
    if contentType == "" {
        contentType = "application/octet-stream"
    }

    return file, header, contentType,nil
}

