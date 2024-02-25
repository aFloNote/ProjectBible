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
	ID   int    `json:"author_id"`
	Name       string `json:"name"`
	Ministry   string `json:"ministry"`
	ImagePath  string `json:"image_path"`
}
type SeriesType struct {
    ID          int    `json:"series_id"`
    Title       string `json:"title"`
    Description string `json:"description"`
    ImagePath   string `json:"image_path"`
    NumOfEps    int    `json:"num_of_eps"`
}
type SermonType struct {
    ID        int    `json:"sermon_id"`
	Title       string `json:"title"`
	DateDelivered time.Time `json:"date_delivered"`
	AudioLink string `json:"audio_link"`
	AuthorId  int    `json:"author_id"`
	SeriesId   int    `json:"series_id"`
	Scripture string `json:"scripture"`
    Desc sql.NullString
    ImagePath  sql.NullString
	SermonSeries string `json:"series_title"`
	
	

}