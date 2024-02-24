export interface  AuthorsType{
    author_id: number;
    name: string;
    ministry: string;
    image_path: string;
  }
export interface SeriesType{
    series_id: string;
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
    audio_path: string;
    video_path: string;
    series_id: string;
    author_id: number;
  }