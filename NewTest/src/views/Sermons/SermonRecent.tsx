import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import DateComp from "@/views/formatting/datesermonformat";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/redux/store";
import { SermonType } from "@/types/sermon";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SiteImage } from "@/image";
export function Recent() {
  const navigate = useNavigate();
  const [state, setState] = useState<{
    items: SermonFullType[];
    hasMoreItems: boolean;
  }>({
    items: [],
    hasMoreItems: true,
  });
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const author_slug = queryParams.get("author");
  const topic_slug = queryParams.get("topic");
  const series_slug = queryParams.get("series");
  const script_slug = queryParams.get("scripture");
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const searchResults = useSelector((state: RootState) => state.search.results);
  const [items, setItems] = useState<SermonFullType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  useEffect(() => {
	console.log(topic_slug)
    if (author_slug){
		dispatch(setSelectedSermonPage("authors"));
	} // remove the leading slash
	else if (series_slug){
		dispatch(setSelectedSermonPage("series"));
	}
	else if (script_slug){
		dispatch(setSelectedSermonPage("scriptures"));
	}
	else if (topic_slug){
		dispatch(setSelectedSermonPage("topics"));
	}
	else{
		dispatch(setSelectedSermonPage("sermons"));
	}

  
  }, [author_slug, series_slug, script_slug, topic_slug,dispatch]);
  let route = "pubfetchsermons";
  let queryKey = "SermonsData";
  function formatSlug(slug: string): string {
    return slug
      .split("-") // Split the slug into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(" "); // Join the words back together with spaces
  }
  
  var title = "";
  if (author_slug) {
    route += "?author_slug=" + author_slug;
    queryKey = "AuthorsData" + author_slug;
    title = "Author: " + formatSlug(author_slug);
  } else if (series_slug) {
    route += "?series_slug=" + series_slug;
    queryKey = "SeriessData" + series_slug;
    title = "Series: " + formatSlug(series_slug);
  } else if (script_slug) {
    route += "?script_slug=" + script_slug;
    queryKey = "ScriptsData" + script_slug;
    title = "Scriptures: " + formatSlug(script_slug);
  } else if (topic_slug) {
    route += "?topic_slug=" + topic_slug;
    queryKey = "TopicsData" + topic_slug;
    title = "Topic: " + formatSlug(topic_slug);
  }
  const searchTerm = useSelector((state: RootState) => state.search.input);

  const { data: sermonsData } = Fetch<SermonFullType[]>(route, queryKey, false);
  useEffect(() => {
    if (searchResults && searchResults.length > 0 && searchTerm !== "") {
      const sermonResults = searchResults
        .filter((result) => result.collection === "sermons")
        .map((result) => result.document as SermonType);
      const filteredSermonsData = sermonsData?.filter((sermonData) =>
        sermonResults.some(
          (sermonResult) =>
            sermonResult.sermon_id === sermonData.SermonType.sermon_id
        )
      );
      console.log(sermonResults), console.log(filteredSermonsData);
      if (filteredSermonsData !== undefined) {
        setItems(filteredSermonsData.slice(0, 200));
      }
    } else {
      if (sermonsData) {
        setItems(sermonsData.slice(0, 200));
      }
    }
  }, [searchResults, sermonsData]);

  const fetchMoreData = () => {
    if (searchResults && searchResults.length > 0) {
      const newItems = searchResults
        .filter((result) => result.collection === "sermons")
        .map((result) => result.document as SermonType)
        .slice(items.length, items.length + 10);

      const filteredSermonsData = sermonsData?.filter((sermonData) =>
        newItems.some(
          (newItem) => newItem.sermon_id === sermonData.SermonType.sermon_id
        )
      );
      if (filteredSermonsData !== undefined)
        setItems((prevItems) => [...prevItems, ...filteredSermonsData]);

      if (items.length + 10 >= searchResults.length) {
        setHasMoreItems(false);
      }
    } else {
      if (!sermonsData) return;
      const newItems = sermonsData.slice(items.length, items.length + 10);
      setItems((prevItems) => [...prevItems, ...newItems]);

      if (items.length + 10 >= sermonsData.length) {
        setHasMoreItems(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 overflow-auto">
        <InfiniteScroll
          dataLength={state.items.length}
          next={fetchMoreData}
          hasMore={state.hasMoreItems}
          loader={<h4></h4>}
          scrollThreshold={0.8}
        >
          <div className="lg:flex lg:flex-wrap lg:h-auto lg:h-64 h-full">
            {items.map((SermonFull, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/sermonlistening/${SermonFull.SermonType.slug}`);
                }}
                className="pt-2 px-2 lg:w-1/2 lg:px-15 "
              >
                <Card>
                  <CardContent className="flex lg:flex-col items-center pt-2 pb-2 px-5 space-x-2 cursor-pointer">
                    <div className="lg:hidden">
                      <DateComp date={SermonFull.SermonType.date_delivered} />
                    </div>
                    <div className="flex lg:flex-col items-center space-x-2">
                      <SiteImage
                        divClass="w-14 h-14 lg:h-32 lg:w-32 flex items-center rounded-full"
                        ratio={1}
                        alt="Topic Image"
                        source={
                          b2endpoint +
                          encodeURIComponent(SermonFull.SeriesType.image_path)
                        }
                      />

                      <div className="flex flex-col leading-none lg:hidden  w-full">
                        <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-md leading-none">
                          {SermonFull.SermonType.title}
                        </h2>
                        <p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-sm  leading-none">
                          {SermonFull.SeriesType.title}
                        </p>
                        <div></div>
                        <p className="whitespace-nowrap overflow-ellipsis overflow-hidden font-medium  text-primary text-xs leading-tight">
                          {SermonFull.SermonType.scripture}
                        </p>
                      </div>
                    </div>

					<div className=" lg:border-b lg:text-gray-600 lg:pt-2 w-5/6"></div>

					<div className="lg:flex lg:justify-center lg:pt-2">
					<div className="flex flex-col hidden lg:block">
				<div className='flex text-center lg:leading-tight'>
				
					<DateComp date={SermonFull.SermonType.date_delivered} />
					
					</div>
                    <h2 className="lg:text-xl lg:text-center hidden lg:block lg:leading-none">
                      {SermonFull.SermonType.title}
                    </h2>
                    <p className="lg:text-md lg:text-gray-600 lg:text-center hidden lg:block lg:leading-tight">
                      {SermonFull.SeriesType.title}
                    </p>
                    <p className="lg:text-sm lg:font-normal lg:text-center lg:text-primary hidden lg:block lg:leading-tight">
                      {SermonFull.SermonType.scripture}
                    </p>
					</div>
					</div>


                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </ScrollArea>
    </div>
  );
}
export default Recent;
