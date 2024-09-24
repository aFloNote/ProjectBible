import { SearchPageFetch } from "@/hooks/sermonhooks";
import { SeriesType } from "@/types/sermon";
import { SiteImage } from "@/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setSelectedSermonPage } from "@/redux/sermonAdminSelector";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useContext } from "react";
import { useTheme } from "@/components/theme-provider"; // adjust this import based on your actual file structure

export function Series() {
  const [items, setItems] = useState<SeriesType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const location = useLocation();
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const queryParams = new URLSearchParams(location.search);
  const author_id = queryParams.get("author");
  const searchResults = useSelector((state: RootState) => state.search.results);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const currentPath = location.pathname;
    let pageName = currentPath.substring(1); // remove the leading slash

    // If the path is nested, you might want to get only the first part
    if (pageName.includes("/")) {
      pageName = pageName.split("/")[0];
    }

    if (!author_id) dispatch(setSelectedSermonPage(pageName));
  }, [location, dispatch]);
  let route = "pubfetchseries";
  let queryKey = "SeriesData";
  if (author_id) {
    route += "?author_id=" + author_id;
    queryKey = "SeriesData" + author_id;
  }
  const { data: seriesData } = SearchPageFetch<SeriesType[]>(route, queryKey);
  const searchTerm = useSelector((state: RootState) => state.search.input);

  useEffect(() => {
    if (searchResults && searchResults.length > 0 && searchTerm !== "") {
      const seriesResults = searchResults
        .filter((result) => result.collection === "series")
        .map((result) => result.document as SeriesType);
      setItems(seriesResults.slice(0, 200));
    } else {
      if (seriesData) setItems(seriesData.slice(0, 200));
    }
  }, [searchResults, seriesData]);

  const fetchMoreData = () => {
    if (searchResults && searchResults.length > 0) {
      const newItems = searchResults
        .filter((result) => result.collection === "series")
        .map((result) => result.document as SeriesType)
        .slice(items.length, items.length + 10);

      setItems((prevItems) => [...prevItems, ...newItems]);

      if (items.length + 10 >= searchResults.length) {
        setHasMoreItems(false);
      }
    } else {
      if (!seriesData) return;
      const newItems = seriesData.slice(items.length, items.length + 10);
      setItems((prevItems) => [...prevItems, ...newItems]);

      if (items.length + 10 >= seriesData.length) {
        setHasMoreItems(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full pb-36 lg:pb-10">
      <ScrollArea className="flex-1 overflow-auto">
        <InfiniteScroll
          dataLength={items.length}
          next={fetchMoreData}
          hasMore={hasMoreItems}
          loader={<h4></h4>}
          scrollThreshold={0.8}
        >
          <div className="lg:pb-1 lg:flex lg:flex-wrap lg:h-auto lg:h-64 h-full">
            {items.map((series, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/sermons?series=${series.slug}`);
                }}
                className="pt-2 px-2 lg:w-1/3 lg:px-15 "
              >
                <Card>
                  <div className="flex items-center pt-1 pb-1 lg:pt-4 px-5 space-x-2 lg:justify-center">
                    <div>
                      <SiteImage
                        divClass="w-12 h-12 lg:h-32 lg:w-32 rounded-full lg:mx-auto cursor-pointer"
                        ratio={1}
                        alt="Series Image"
                        source={
                          theme === "dark" && series.slug === "misc"
                            ? 
                              "https://f004.backblazeb2.com/file/FaithBible/logos/FBC%2BTV%2BLogo%2Bwhite%2Bnotext.png"
                            : b2endpoint + encodeURIComponent(series.image_path)
                        }
                      />
                    </div>
                    <div className="flex-grow min-w-0 lg:hidden">
                      <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden leading-none text-lg cursor-pointer">
                        {series.title}
                      </h2>
                    </div>
                  </div>
                  <div className=" lg:border-b lg:text-gray-600 lg:pt-2 "></div>

                  <div className="lg:flex lg:justify-center lg:pt-2 lg:pb-2 cursor-pointer">
                    <div className="flex flex-col hidden lg:block">
                      <h2 className="lg:text-xl lg:text-center hidden lg:block lg:leading-none">
                        {series.title}
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
export default Series;
