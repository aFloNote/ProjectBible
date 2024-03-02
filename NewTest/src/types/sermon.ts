export interface  AuthorType{
    author_id: string;
    bio_link: string;
    name: string;
    ministry: string;
    image_path: string;
    slug: string;
  }
export interface SeriesType{
    series_id: string;
    title: string;
    description:string;
    date_published: string;
    image_path: string;
    slug: string;
  }
export interface SermonType{
    sermon_id: string;
    title: string;
    date_delivered: string;
    scripture: string;
    audio_link: string;
    video_path: string;
    series_id: string;
    author_id: string;
    slug: string;
    author_slug: string;
    series_slug: string;
  }

export interface SermonFullType{
  SermonType: SermonType;
  AuthorType: AuthorType;
  SeriesType: SeriesType
}
