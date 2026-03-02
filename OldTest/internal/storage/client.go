package fileStorage

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	db "github.com/aFloNote/ProjectBible/OldTest/internal/postgres"
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

func CopyDelete(minioClient *minio.Client, bucketName, path,newPath string) error {

	src := minio.CopySrcOptions{
		Bucket: bucketName,
		Object: path,
	}
	
	// Destination object
	
	dst := minio.CopyDestOptions{
		Bucket: bucketName,
		Object: newPath,
	}
	
	// Copy object call
	_, err := minioClient.CopyObject(context.Background(), dst, src)
	if err != nil {
		fmt.Println(err)
		return err
	}
	

	err = minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, minio.RemoveObjectOptions{})
	if err != nil {
			fmt.Fprintf(os.Stderr, "Error removing old files,: %v\n",err)
			
			return err
	
	}
	return nil
}

func ProcessPathFiles(minioClient *minio.Client, theType, srcType string, r *http.Request, slug string) (string,error) {
    ID := r.FormValue(fmt.Sprintf("%s_id", theType))

    file, header, contentType, err := ParseFile(r, 10<<20, srcType) 

    if err != nil {
        fmt.Fprintf(os.Stderr, "Process file error: %v\n", err)
        return "",err
    }
    defer file.Close()

    decodedURL, err := url.QueryUnescape(header.Filename)
    if err != nil {
        fmt.Println("Error:", err)
        return "",err
    }
    
    var currentSlug string
    var currentPath string
    query:=""
    if theType=="series"{
        query = fmt.Sprintf("SELECT %s_path, slug FROM %s WHERE %s_id = $1",srcType, theType, theType)
    }else{
		if srcType=="text"{
			query = fmt.Sprintf("SELECT note_path, slug FROM %ss WHERE %s_id = $1",theType, theType)
		}else{
         query = fmt.Sprintf("SELECT %s_path, slug FROM %ss WHERE %s_id = $1",srcType, theType, theType)
		}
    }
    err = db.QueryRow(query, ID).Scan(&currentPath, &currentSlug)
    if err != nil {
        fmt.Fprintf(os.Stderr, "scan db for slug error: %v\n", err)
        return "",err
    }
  
   path:=""
   newPath:=""
   if theType=="series"{
        newPath = fmt.Sprintf("sermons/%s/%s/%s/%s", theType, slug, srcType, filepath.Base(decodedURL))
   } else{
    newPath = fmt.Sprintf("sermons/%ss/%s/%s/%s", theType, slug, srcType, filepath.Base(decodedURL))
   }

    if currentSlug != slug {
        fileInStorage := GetPath(theType, decodedURL, theType)
        fmt.Println("File in storage")
        fmt.Println(fileInStorage)
        if fileInStorage {
            err = CopyDelete(minioClient, os.Getenv("STORAGE_BUCKET"), decodedURL, newPath)
            path = newPath
            if err != nil {
                fmt.Fprintf(os.Stderr, "Error copying file: %v\n", err)
                return "",err
            }
			return path,err
        } 
            fmt.Println("File not in storage")
            path:=""
            if theType=="series"{
                path = fmt.Sprintf("sermons/%s/%s/%s/%s", theType, currentSlug, srcType, filepath.Base(currentPath))
            } else{
                path = fmt.Sprintf("sermons/%ss/%s/%s/%s", theType, currentSlug, srcType, filepath.Base(currentPath))
            }
            print(path)
            err = minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, minio.RemoveObjectOptions{})
            if err != nil {
                fmt.Fprintf(os.Stderr, "Error removing old files,: %v\n", err)
                return "",err
            }
            if theType=="series"{
                path = fmt.Sprintf("sermons/%s/%s/%s/%s", theType, slug, srcType, header.Filename)
            } else{

                path = fmt.Sprintf("sermons/%ss/%s/%s/%s", theType, slug, srcType, header.Filename)
            }    
        
           
            upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
            if err != nil {
                fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo, err)
                return "",err
            }
            return path,err
        


        
        
    }
	if strings.HasPrefix(decodedURL, "sermons/"+theType){
		return decodedURL,err
	}
	err = minioClient.RemoveObject(context.Background(), os.Getenv("STORAGE_BUCKET"), currentPath, minio.RemoveObjectOptions{})
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error removing old files,: %v\n", err)
		return "",err
	}
    if theType=="series"{
        path = fmt.Sprintf("sermons/%s/%s/%s/%s", theType, slug, srcType, header.Filename)
    } else{
	    path = fmt.Sprintf("sermons/%ss/%s/%s/%s", theType, slug, srcType, header.Filename)
    }
	upLoadInfo, err := minioClient.PutObject(context.Background(), os.Getenv("STORAGE_BUCKET"), path, file, header.Size, minio.PutObjectOptions{ContentType: contentType})
	if err != nil {
		fmt.Fprintf(os.Stderr, "upload file error: %v %v\n", upLoadInfo, err)
		return "",err
	}

    return path,err
}

func GetPath(obType,filePath,srcType string,) bool {
	// Upload the file with FPutObject
	return strings.HasPrefix(filePath, "sermons/"+obType)
	
	
}