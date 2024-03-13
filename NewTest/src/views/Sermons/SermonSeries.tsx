import { Fetch } from "@/hooks/sermonhooks";
import { SeriesType } from "@/types/sermon";
import { Link } from "react-router-dom";
import { SiteImage } from "@/image";
import {useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setSelectedSermonPage } from "@/redux/sermonAdminSelector";



export function Series() {
    const [items, setItems] = useState<SeriesType[]>([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const location = useLocation();
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const queryParams = new URLSearchParams(location.search);
  const author_id = queryParams.get('author_id');
 
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname;
    let pageName = currentPath.substring(1); // remove the leading slash

    // If the path is nested, you might want to get only the first part
    if (pageName.includes('/')) {
      pageName = pageName.split('/')[0];
    }

    dispatch(setSelectedSermonPage(pageName));
  }, [location, dispatch]);
  let route='pubfetchseries';
  let queryKey='SeriesData';
  if (author_id)  {
    route+='?author_id='+author_id;
    queryKey='SeriesData'+author_id;
}
  const { data: seriesData } = Fetch<SeriesType[]>(
    route,
    queryKey,
    false
  );
  console.log(seriesData);
  useEffect(() => {
    if (seriesData) {
      setItems(seriesData.slice(0, 200));
    }
  }, [seriesData]);
  const fetchMoreData = () => {
    if (seriesData) {
      const newItems = seriesData.slice(items.length, items.length + 10);
  
      setItems(prevItems => [...prevItems, ...newItems]);
  
      if (items.length + 10 >= seriesData.length) {
        setHasMoreItems(false);
      }
    }
  };

  return (
    <div className='pb-16'>
     <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
      {seriesData?.map((series) => (
        <div className="pt-2 px-2" key={series.series_id}>
          <Link to={`/sermons?series=${series.slug}`}>
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center space-x-4">
                  <SiteImage
                    divClass="w-16 h-16 rounded-full"
                    ratio={1}
                    alt="series Image"
                    source={b2endpoint + encodeURIComponent(series.image_path)}
                  />
                  <div>
                    <h2 className="text-xl">{series.title}</h2>
                    <p className='text-gray-600'>{series.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
      </InfiniteScroll>
    </div>
  );
}
export default Series;
