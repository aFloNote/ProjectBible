import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";
import { useNavigate } from "react-router-dom";
import { SiteImage } from "@/image";
import { Card} from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";



import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; 
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function topics() {
	
	const navigate = useNavigate();
 
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
	<div className="flex flex-col h-full pb-20 lg:pb-10">
	<ScrollArea className="flex-1 overflow-auto">
	  <InfiniteScroll
		dataLength={items.length}
		next={fetchMoreData}
		hasMore={hasMoreItems}
		loader={<h4></h4>}
		scrollThreshold={0.8}
	  >
		<div className="pb-22 lg:pb-1 lg:flex lg:flex-wrap lg:h-auto lg:h-64 h-full ">
		  {items.map((topic, index) => (
			<div
			  key={index}
			  onClick={() => {
				navigate(`/sermons?topic=${topic.slug}`);
			  }}
			  className="pt-2 px-2 lg:w-1/3 lg:px-15 "
			>
			  <Card>
				<div className="flex items-center pt-1 pb-1 lg:pt-4 px-5 space-x-2 lg:justify-center">
				 
				  <div>
					  
					<SiteImage
					  divClass="w-12 h-12 lg:h-32 lg:w-32 rounded-full lg:mx-auto"
					  ratio={1}
					  alt="Topic Image"
					  source={
						b2endpoint +
						encodeURIComponent(topic.image_path)
					  }
					/>
				  </div>
				  <div className="flex-grow min-w-0 lg:hidden">
					<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden leading-none text-lg">
					  {topic.name}
					</h2>
				
				  </div>
				</div>
				<div className=" lg:border-b lg:text-gray-600 lg:pt-2 "></div>

				<div className="lg:flex lg:justify-center lg:pt-2 lg:pb-2">
				  <div className="flex flex-col hidden lg:block">
					
					<h2 className="lg:text-xl lg:text-center hidden lg:block lg:leading-none">
					  {topic.name}
					</h2>
				  </div>
				</div>
			  </Card>
			</div>
		  ))}
		</div>
	  </InfiniteScroll>
	</ScrollArea>
  </div>






	
  );
}
export default topics;
