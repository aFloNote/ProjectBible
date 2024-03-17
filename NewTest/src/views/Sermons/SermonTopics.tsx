import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";

import { SiteImage } from "@/image";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link, useLocation} from "react-router-dom";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; 
import {ScrollArea} from "@/components/ui/scroll-area";
export function Topics() {
  
 
  const [items, setItems] = useState<TopicType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const location = useLocation();
  const dispatch = useDispatch();
  const searchResults = useSelector((state: RootState) => state.search.results);
  const searchTerm = useSelector((state: RootState) => state.search.input);
  useEffect(() => {
    const currentPath = location.pathname;
    let pageName = currentPath.substring(1); // remove the leading slash

    // If the path is nested, you might want to get only the first part
    if (pageName.includes('/')) {
      pageName = pageName.split('/')[0];
    }

    dispatch(setSelectedSermonPage(pageName));
  }, [location, dispatch]);
  const { data: topicsData } = Fetch<TopicType[]>(
    "pubfetchtopics",
    "TopicData",
    false
  );

useEffect(() => {
	
  if (searchResults && searchResults.length > 0 && searchTerm !== "") {
    const topicResults = searchResults
      .filter(result => result.collection === 'topics')
      .map(result => result.document as TopicType);
    setItems(topicResults.slice(0, 200));
  } else {
	if(topicsData)
    setItems(topicsData.slice(0, 200));
  }
}, [searchResults, topicsData]);

const fetchMoreData = () => {
  if (searchResults && searchResults.length > 0) {
    const newItems = searchResults
      .filter(result => result.collection === 'topics')
      .map(result => result.document as TopicType)
      .slice(items.length, items.length + 10);

    setItems((prevItems) => [...prevItems, ...newItems]);

    if (items.length + 10 >= searchResults.length) {
      setHasMoreItems(false);
    }
  } else {
	if (!topicsData) return;
    const newItems = topicsData.slice(items.length, items.length + 10);
    setItems((prevItems) => [...prevItems, ...newItems]);

    if (items.length + 10 >= topicsData.length) {
      setHasMoreItems(false);
    }
  }
};

  

  return (
    <div className="flex flex-col h-full pb-24 lg:pb-10">
	<ScrollArea className="flex-1 overflow-auto">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4></h4>}
        scrollThreshold={0.8}
      >
		
		<div className="h-full  lg:flex lg:flex-wrap lg:h-full">

        {items?.map((topic) => (
          <div className="pt-2 px-2 lg:w-1/3 lg:px-15" key={topic.topic_id}>
               <Link to={`/sermons?topic=${topic.slug}`}>
            <Card>
              <CardContent className="pt-5 lg:px-10">
			  <div className="flex lg:flex-col items-center space-x-4">
                  {topic.image_path !== "default" && (
                    <SiteImage
					divClass="w-16 h-16 lg:h-32 lg:w-32 rounded-full"
                      ratio={1}
                      alt="Topic Image"
                      source={
                        b2endpoint + encodeURIComponent(topic.image_path)
                      }
                    />
                  )}
				 
				 <h2 className="text-xl lg:hidden">{topic.name}</h2>
				</div>
				<div className=' lg:border-b lg:text-gray-600 lg:pt-2'></div>
				  <div className="lg:flex lg:justify-center lg:pt-2">
				  <h2 className="lg:text-xl lg:text-center hidden lg:block">{topic.name}</h2>
				  </div>
              </CardContent>
            </Card>
            </Link>
          </div>

        ))}
		</div>
	
      </InfiniteScroll>
	  </ScrollArea>
    </div>
  );
}
export default Topics