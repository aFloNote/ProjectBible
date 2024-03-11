import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";

import { SiteImage } from "@/image";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link, useLocation} from "react-router-dom";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import { useDispatch } from "react-redux";
export function Topics() {
  
 
  const [items, setItems] = useState<TopicType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const location = useLocation();
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
  const { data: topicsData } = Fetch<TopicType[]>(
    "pubfetchtopics",
    "TopicData",
    false
  );
  useEffect(() => {
    if (topicsData) {
      setItems(topicsData.slice(0, 200));
    }
  }, [topicsData]);
  const fetchMoreData = () => {
    if (topicsData) {
      const newItems = topicsData.slice(items.length, items.length + 10);

      setItems((prevItems) => [...prevItems, ...newItems]);

      if (items.length + 10 >= topicsData.length) {
        setHasMoreItems(false);
      }
    }
  };

  

  return (
    <div className="pb-16">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
        {topicsData?.map((topic) => (
          <div className="pt-2 px-2" key={topic.topic_id}>
               <Link to={`/sermons?topic=${topic.slug}`}>
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center space-x-4">
                  {topic.image_path !== "default" && (
                    <SiteImage
                      divClass="w-16 h-16 rounded-full"
                      ratio={1}
                      alt="Author Image"
                      source={
                        b2endpoint + encodeURIComponent(topic.image_path)
                      }
                    />
                  )}
                  <h2 className="text-xl">{topic.name}</h2>
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
export default Topics