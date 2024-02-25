import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import DateComp from "@/views/formatting/datesermonformat";

import { useNavigate} from 'react-router-dom';


export function Recent() {
  const { data: sermonsData } = Fetch<SermonFullType[]>(
    "pubfetchsermons",
    "SermonsData",
    false
  );
  console.log(sermonsData)

  const navigate = useNavigate();
  const [items, setItems] = useState<SermonFullType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  useEffect(() => {
    if (sermonsData) {
      const initialSermons = Array(200).fill(sermonsData).flat().slice(0, 200);
      setItems(initialSermons);
    }
  }, [sermonsData]);

  const fetchMoreData = () => {
    setTimeout(() => {
      if (sermonsData) {
        const newItems = items.concat(
          Array(50)
            .fill(sermonsData)
            .flat()
            .slice(items.length, items.length + 10)
        );
        setItems(newItems);

        if (newItems.length >= sermonsData.length * 20) {
          setHasMoreItems(false);
        }
      }
    }, 500);
  };

  return (
    <div className="pt-4 no-scrollbar flex-grow overflow-auto">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
        {items.map((SermonFull, index) => (
        <div key={index} onClick={() => 
          {
            console.log(SermonFull.SermonType.sermon_id)
            navigate(`/Sermon/${SermonFull.SermonType.sermon_id}`)
        
          }
        }>
            <div className="grid grid-cols-5 gap-4 px-4 pt-2 pb-2 items-center">
              <DateComp date={SermonFull.SermonType.date_delivered} />
              <div className="col-span-4">
                <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                  {SermonFull.SermonType.title}
                </h2>
                <p className="text-gray-500 font-bold text-xs">
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
