import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import DateComp from "@/views/formatting/datesermonformat";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import {SearchPage} from "@/components/searchpage";
import { useDispatch } from "react-redux";

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
  const dispatch=useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const author_slug = queryParams.get("author");
  const topic_slug = queryParams.get("topic");
  const series_slug = queryParams.get("series");
  const script_slug = queryParams.get("scripture");
  const b2endpoint =import.meta.env.VITE_REACT_B2_ENDPOINT
  

  useEffect(() => {
    const currentPath = location.pathname;
    let pageName = currentPath.substring(1); // remove the leading slash

    // If the path is nested, you might want to get only the first part
    if (pageName.includes('/')) {
      pageName = pageName.split('/')[0];
    }

    dispatch(setSelectedSermonPage(pageName));
  }, [location, dispatch]);
  let route = "pubfetchsermons";
  let queryKey = "SermonsData";
  function formatSlug(slug: string): string {
    return slug
      .split('-') // Split the slug into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together with spaces
  }
  useEffect(() => {
   
      dispatch(setSelectedSermonPage("sermons"));
   

  }, [author_slug, series_slug, script_slug, topic_slug, dispatch]);
  var title="";
  if (author_slug) {
    route += "?author_slug=" + author_slug;
    queryKey = "AuthorsData" + author_slug;
    title="Author: "+formatSlug(author_slug);
    
  } else if (series_slug) {
    route += "?series_slug=" + series_slug;
    queryKey = "SeriessData" + series_slug;
    title="Series: "+formatSlug(series_slug);
  } else if (script_slug){
    route += "?script_slug=" + script_slug;
    queryKey = "ScriptsData" + script_slug;
    title="Scriptures: "+formatSlug(script_slug)
  }else if (topic_slug){
    route += "?topic_slug=" + topic_slug;
    queryKey = "TopicsData" + topic_slug;
    title="Topic: "+formatSlug(topic_slug)
  }
 
  console.log("here +" + route + " " + queryKey)

  const { data: sermonsData } = Fetch<SermonFullType[]>(route, queryKey, false);
  console.log("here +" + route + " " + queryKey)
  console.log('sermonData '+sermonsData)
  console.log("state.items "+state.items)
  const fetchMoreData = () => {
    if (sermonsData) {
      const newItems = sermonsData.slice(
        state.items.length,
        state.items.length + 10
      );
      const updatedItems = [...state.items, ...newItems];
      const hasMoreItems = updatedItems.length < sermonsData.length;

      setState({ items: updatedItems, hasMoreItems });
    }
  };
  useEffect(() => {
    fetchMoreData();
  }, [sermonsData]);

  return (
    <div className="pt-4 pb-16 no-scrollbar overflow-hidden">
		<SearchPage/>
		   <div className="flex items-center pt-4 pb-4 px-5 space-x-4">        
          <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-2xl">
                  {title}
                </h2>
                
          </div>
      <InfiniteScroll
        dataLength={state.items.length}
        next={fetchMoreData}
        hasMore={state.hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
       
     
        
          <div className="border-t text-gray-300 "></div>
        {state.items.map((SermonFull, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/sermonlistening/${SermonFull.SermonType.slug}`);
            }}
			className='cursor-pointer'
          
          >
            <div className="flex items-center pt-4 pb-4 px-5 space-x-4">
              <div className="">
                <DateComp date={SermonFull.SermonType.date_delivered} />
              </div>
              <div>
                <Avatar className='w-16 h-16'>
                  <AvatarImage
                    src={
                      b2endpoint +
                      encodeURIComponent(SermonFull.SeriesType.image_path)
                    }
                  />
                </Avatar>
              </div>
              <div className="flex-grow min-w-0 leading-none">
                <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-xl leading-none">
                  {SermonFull.SermonType.title}
                </h2>
                <p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-lg font-medium pl-1">{SermonFull.SeriesType.title}</p>
				<div></div>
				<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-md pl-1">{SermonFull.SermonType.scripture}</p>
              </div>
            </div>
            <div className="border-t text-gray-300"></div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
export default Recent;