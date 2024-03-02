package types

import (
	"database/sql"
	"time"
)

type SermonFull struct {
   AuthorType  AuthorType
   SeriesType SeriesType
   SermonType SermonType
}
type AuthorType struct {
	AuthorID   string    `json:"author_id"`
	Name      string `json:"name"`
	Ministry   string `json:"ministry"`
	Image_Path  string `json:"image_path"`
	Bio_Link string `json:"bio_link"`
	Slug 	 string `json:"slug"`
}
type SeriesType struct {
    SeriesID          string    `json:"series_id"`
    Title       string `json:"title"`
    Desc string `json:"description"`
    Image_Path   string `json:"image_path"`
	Date_Published time.Time `json:"date_published"`
	Slug 	 string `json:"slug"`
}
type SermonType struct {
    SermonID       string    `json:"sermon_id"`
	Title       string `json:"title"`
	DateDelivered time.Time `json:"date_delivered"`
	Audio_Path string `json:"audio_path"`
	AuthorID  string    `json:"author_id"`
	SeriesID   string    `json:"series_id"`
	Scripture string `json:"scripture"`
    Desc sql.NullString
    Image_Path  sql.NullString
	Topic sql.NullString
	Slug string `json:"slug"`
	
	

}