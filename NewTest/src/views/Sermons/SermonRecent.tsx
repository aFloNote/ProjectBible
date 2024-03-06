import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import DateComp from "@/views/formatting/datesermonformat";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

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
  const queryParams = new URLSearchParams(location.search);
  const author_slug = queryParams.get("author");
  const series_slug = queryParams.get("series");
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  let route = "pubfetchsermons";
  let queryKey = "SermonsData";

  if (author_slug) {
    route += "?author_slug=" + author_slug;
    queryKey = "SermonsData" + author_slug;
  } else if (series_slug) {
    route += "?series_slug=" + series_slug;
    queryKey = "SermonsData" + series_slug;
  }
  const { data: sermonsData } = Fetch<SermonFullType[]>(route, queryKey, false);
  console.log(sermonsData)
  console.log(state.items)
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
    <div className="pt-4 pb-16 no-scrollbar overflow-auto">
      <InfiniteScroll
        dataLength={state.items.length}
        next={fetchMoreData}
        hasMore={state.hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
        {state.items.map((SermonFull, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/sermonlistening/${SermonFull.SermonType.slug}`);
            }}
          >
            <div className="flex items-center pt-4 pb-4 px-5 space-x-4">
              <div className="">
                <DateComp date={SermonFull.SermonType.date_delivered} />
              </div>
              <div>
                <Avatar>
                  <AvatarImage
                    src={
                      b2endpoint +
                      encodeURIComponent(SermonFull.SeriesType.image_path)
                    }
                  />
                </Avatar>
              </div>
              <div className="flex-grow min-w-0">
                <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-lg">
                  {SermonFull.SermonType.title}
                </h2>
                <p className="text-gray-600">{SermonFull.SeriesType.title}</p>
              </div>
            </div>
            <div className="border-t text-gray-300"></div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}
