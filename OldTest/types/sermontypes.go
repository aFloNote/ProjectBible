package types

import (
	
	"time"
)

type SermonFull struct {
   AuthorType  AuthorType
   SeriesType SeriesType
   SermonType SermonType
   TopicType TopicType
   ScriptureType ScriptureType
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
    Description string `json:"description"`
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
	ScriptureID string `json:"scripture_id"`
	TopicID string `json:"topic_id"`
	Scripture string `json:"scripture"`
	TypesenseDate string `json:"typesense_date"`
    Description string `json:"description"`
    Image_Path  string `json:"image_path"`
	Slug string `json:"slug"`
}
type TopicType struct {
	TopicID   string    `json:"topic_id"`
	Name      string `json:"name"`
	Image_Path  string `json:"image_path"`
	Slug 	 string `json:"slug"`
}
type ScriptureType struct {
	ScriptureID   string    `json:"scripture_id"`
	Book     string `json:"book"`
	Image_Path  string `json:"image_path"`
	Slug 	 string `json:"slug"`
}
type SearchType struct {
	ID   string `json:"searchid"`
	Primary   string `json:"primary"`
	Secondary     string `json:"secondary"`
	TheType  string `json:"theType"`
	Slug 	 string `json:"slug"`
} 