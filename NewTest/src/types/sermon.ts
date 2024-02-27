export interface  AuthorType{
    author_id: number;
    name: string;
    ministry: string;
    image_path: string;
  }
export interface SeriesType{
    series_id: number;
    title: string;
    description:string;
    image_path: string;
    num_of_eps: number;
  }
export interface SermonType{
    sermon_id: number;
    title: string;
    date_delivered: string;
    scripture: string;
    audio_link: string;
    video_path: string;
    series_id: number;
    author_id: number;
  }

export interface SermonFullType{
  SermonType: SermonType;
  AuthorType: AuthorType;
  SeriesType: SeriesType
}
