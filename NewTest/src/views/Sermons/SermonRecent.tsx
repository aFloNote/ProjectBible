import  { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Fetch} from "@/hooks/sermonhooks";
import {SermonType} from "@/types/sermon";

export function Recent() {
  const { data: sermonsData } = Fetch<SermonType[]>(
    "pubfetchsermons",
    "SermonsData",
    false
  );

  const [items, setItems] = useState<SermonType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  useEffect(() => {
    if (sermonsData) {
      setItems(sermonsData.slice(0, 10));
    }
  }, [sermonsData]);

  const fetchMoreData = () => {
	if (sermonsData && items.length >= sermonsData.length) {
	  setHasMoreItems(false);
	  return;
	}
  
	// simulate network request
	setTimeout(() => {
	  if (sermonsData) {
		setItems(items.concat(sermonsData.slice(items.length, items.length + 10)));
	  }
	}, 500);
  };

    if (sermonsData) {
    setTimeout(() => {
      setItems(items.concat(sermonsData.slice(items.length, items.length + 10)));
    }, 500);
	}
  

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((sermon, index) => (
          <div key={index}>
            <h2>{sermon.title}</h2>
            <p>{sermon.date_delivered}</p>
            <p>{sermon.author_id}</p>
          </div>
        ))}
      </InfiniteScroll>
    </main>
  );
}