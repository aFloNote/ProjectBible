import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import DateComp from "@/views/formatting/datesermonformat";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";

export function Recent() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SermonFullType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const author_id = queryParams.get('author_id');
  const series_id = queryParams.get('series_id');
  let route='pubfetchsermons';
  let queryKey='SermonsData';
 
  if (author_id)  {
      route+='?author_id='+author_id;
      queryKey='SermonsData'+author_id;
  }
  else if (series_id) {
      route+='?series_id='+series_id;
      queryKey='SermonsData'+series_id;
  }
  const { data: sermonsData } = Fetch<SermonFullType[]>(
    route,
    queryKey,
    false
  );
 
console.log(sermonsData)

  useEffect(() => {
    if (sermonsData) {
      setItems(sermonsData.slice(0, 100));
    }
  }, [sermonsData]);

  const fetchMoreData = () => {
    if (sermonsData) {
      const newItems = sermonsData.slice(items.length, items.length + 10);
  
      setItems(prevItems => [...prevItems, ...newItems]);
  
      if (items.length + 10 >= sermonsData.length) {
        setHasMoreItems(false);
      }
    }
  };

  return (
    <div className="pt-4 pb-16 no-scrollbar overflow-auto">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
        {items.map((SermonFull, index) => (
          <div
            key={index}
            onClick={() => {
              console.log(SermonFull.SermonType.sermon_id);
              navigate(`/sermonlistening/${SermonFull.SermonType.sermon_id}`);
            }}
          >
            <div className="grid grid-cols-5 gap-4 px-4 pt-4 pb-4 items-center ">
              <DateComp date={SermonFull.SermonType.date_delivered} />
              <div className="col-span-4 leading-none">
                <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-lg">
                  {SermonFull.SermonType.title}
                </h2>
                <p className="text-gray-600 leading-none">
                  {SermonFull.SeriesType.title}
                </p>
              </div>
            </div>
            <div className="border-t text-gray-300"></div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
