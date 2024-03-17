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
    audio_path: string;
    video_path: string;
    series_id: string;
    author_id: string;
    slug: string;
    author_slug: string;
    series_slug: string;
    scripture_id: string;
    topic_id: string;
  }
export interface TopicType{
    topic_id: string;
    name: string;
    image_path: string;
    slug: string;
  }
  export interface ScriptureType{
    scripture_id: string;
    book: string;
    image_path: string;
    slug: string;
  }

export interface SermonFullType{
  SermonType: SermonType;
  AuthorType: AuthorType;
  SeriesType: SeriesType;
  TopicType: TopicType;
  ScriptureType: ScriptureType;
}
export interface SearchType{
  SermonType: SermonType;
  AuthorType: AuthorType;
  SeriesType: SeriesType;
  TopicType: TopicType;
  ScriptureType: ScriptureType;
}
export type SearchResult =
  | { collection: 'sermons'; document: SermonType }
  | { collection: 'topics'; document: TopicType }
  | { collection: 'series'; document: SeriesType }
  | { collection: 'authors'; document: AuthorType }
  | { collection: 'scriptures'; document: ScriptureType }
  | { collection: ''; document: "" };