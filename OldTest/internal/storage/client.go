package fileStorage

import (
	"context"
	"log"
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
func listBuckets(minio *minio.Client) {
	buckets, err := minio.ListBuckets(context.Background())
	if err != nil {
		log.Fatalf("Failed to list buckets: %v", err)
	}

	log.Printf("Successfully connected to MinIO! Client: %#v\n", minio)
	for _, bucket := range buckets {
		log.Printf("Bucket found: %s", bucket.Name)
	}
}