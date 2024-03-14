

import { Fetch } from "@/hooks/sermonhooks";
import { AuthorType} from "@/types/sermon";

import { SiteImage } from "@/image";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
 
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import {SearchPage} from "@/components/searchpage";
export function Authors() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AuthorType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const location = useLocation();
  const dispatch = useDispatch();
  const { data: authorsData } = Fetch<AuthorType[]>(
    "pubfetchauthors",
    "AuthorData",
    false
  );
  useEffect(() => {
    const currentPath = location.pathname;
    let pageName = currentPath.substring(1); // remove the leading slash

    // If the path is nested, you might want to get only the first part
    if (pageName.includes('/')) {
      pageName = pageName.split('/')[0];
    }
	console.log(pageName)
    dispatch(setSelectedSermonPage(pageName));
  }, [location, dispatch]);
  useEffect(() => {
    if (authorsData) {
      setItems(authorsData.slice(0, 200));
    }
  }, [authorsData]);
  const fetchMoreData = () => {
    if (authorsData) {
      const newItems = authorsData.slice(items.length, items.length + 10);
  
      setItems(prevItems => [...prevItems, ...newItems]);
  
      if (items.length + 10 >= authorsData.length) {
        setHasMoreItems(false);
      }
    }
  };
  

  

  return (
    <div className='pb-16 overflow-hidden'>
		<SearchPage/>
    <InfiniteScroll
       dataLength={items.length}
       next={fetchMoreData}
       hasMore={hasMoreItems}
       loader={<h4></h4>}
       scrollThreshold={0.8}>
			<div className="lg:flex lg:flex-wrap lg:h-auto lg:h-64">
    {authorsData?.map((author) => (
        <div className="pt-2 px-2 lg:w-1/3 lg:px-15"  key={author.author_id}>
          <Card>
		  <CardContent className="pt-5 lg:px-10">
          <div className="flex lg:flex-col items-center space-x-4">
          <SiteImage
            divClass="w-20 h-20 lg:h-32 lg:w-32 rounded-full"
            ratio={1}
            alt='Author Image'
            source={
              b2endpoint +
              encodeURIComponent(author.image_path)
            }
          />
          <div>
            <h2 className="text-xl">{author.name}</h2>
            <p className='text-gray-500'>{author.ministry}</p>
          </div>
        </div>
		<div className='lg:border-b text-gray-600'></div>

        <div className="flex justify-start lg:justify-center pt-2">
          <Button className="mr-2  px-4 py-2 rounded"
          onClick={() => navigate(`/sermons?author=${ author.slug }`)}>
            Sermons
          </Button>
		  <div className='pl-2'>
          <Button className=" rounded"
           onClick={() => navigate(`/sermonseries?author=${ author.slug }`)}>
            Series
          </Button>
		  </div>
        </div>
      </CardContent>
    </Card>
        </div>
      ))}
   
   </div>
  </InfiniteScroll>
  </div>
  );

}
export default Authors