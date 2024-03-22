import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";

import { SiteImage } from "@/image";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";


import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; 
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function topics() {
	

 
  const [items, setItems] = useState<TopicType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
 
  const searchResults = useSelector((state: RootState) => state.search.results);
  
  const { data: topicsData } = Fetch<TopicType[]>(
    "pubfetchtopics",
    "topicData",
    false
  );
  const searchTerm = useSelector((state: RootState) => state.search.input);
  useEffect(() => {
	
	if (searchResults && searchResults.length > 0 && searchTerm !== "") {
	  const topicsResults = searchResults
		.filter(result => result.collection === 'topics')
		.map(result => result.document as TopicType);
	  setItems(topicsResults.slice(0, 200));
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
	<div className="flex flex-col pb-24 lg:pb-10 h-full">
	<ScrollArea className="flex-1 overflow-auto">
  <InfiniteScroll
	dataLength={items.length}
	next={fetchMoreData}
	hasMore={hasMoreItems}
	loader={<h4></h4>}
	scrollThreshold={0.8}
  >
	<div className="pb-12 lg:pb-1 lg:flex lg:flex-wrap lg:h-auto lg:h-64">
	  {items?.map((topic) => (
		<div className="pt-2 px-2 lg:w-1/3 lg:px-15" key={topic.name}>
		  <Link to={`/sermons?topic=${topic.slug}`}>
			<Card>
			<CardContent className='pb-1 lg:py-1 lg:px-10 lg:pt-2'>
				<div className="flex lg:flex-col items-center space-x-4 mx-auto">
				  <SiteImage
					divClass="w-16 h-16 pt-2 lg:pt-0 lg:h-32 lg:w-32 rounded-full"
					ratio={1}
					alt="Topic Image"
					source={
					  b2endpoint + encodeURIComponent(topic.image_path)
					}
				  />
				<div className="flex flex-col lg:hidden overflow-hidden w-full">
					
					<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-xl">
					  {topic.name}
					</h2>
				  
				  </div>
				</div>



				<div className=" lg:border-b lg:text-gray-600 lg:pt-2"></div>
				<div className="lg:flex lg:justify-center lg:pt-2">
				  <div className="flex flex-col">
					<h2 className="lg:text-xl lg:text-center hidden lg:block">
					  {topic.name}
					</h2>
				   
				  </div>
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
export default topics;
