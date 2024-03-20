import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
  DialogHeader,
} from "@/components/SearchDialog";
import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFetch } from "@/hooks/sermonhooks";
import { useState, useEffect, useRef } from "react";
import {
  AuthorType,
  SermonType,
  SeriesType,
  TopicType,
  ScriptureType,
} from "@/types/sermon";
import { Link } from "react-router-dom";
import { MdFormatListBulleted } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";
import { SearchType } from "@/types/sermon";

// Define your components
const iconColor='text-primary'
const darkIconColor='text-blue-500'
const SermonResult = ({
  data,
  setIsDialogOpen,
}: {
  data: SearchType;
  setIsDialogOpen: (open: boolean) => void;
}) => (
  <Link
    to={`/sermonlistening/${data.slug}`}
    onClick={() => setIsDialogOpen(false)}
  >
    <div className="flex items-center pb-1 pt-1 pl-2 space-x-4">
      <div>
	<TbPodium size="20px" className={`${iconColor} dark:${darkIconColor}`}/>
      </div>
      <div className="flex-grow min-w-0 leading-none">
        <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">
          {data.primary}
        </h2>
        <p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-xs md:text-sm">
          {data.secondary}
        </p>
      </div>
    </div>
  </Link>
);

const AuthorResult = ({
  data,
  setIsDialogOpen,
}: {
  data: SearchType;
  setIsDialogOpen: (open: boolean) => void;
}) => (
  <Link
    to={`/sermons?author=${data.slug}`}
    onClick={() => setIsDialogOpen(false)}
  >
    <div className="flex items-center  pb-1 pt-1  pl-2 space-x-4">
      <div>
        <IoPersonCircleOutline size="20px" className={`${iconColor} dark:${darkIconColor}`} />
      </div>
      <div className="flex-grow min-w-0 leading-none">
        <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">
          {data.primary}
        </h2>
        <p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-xs md:text-sm">
          {data.secondary}
        </p>
      </div>
    </div>
  </Link>
);

const SeriesResult = ({
  data,
  setIsDialogOpen,
}: {
  data: SearchType;
  setIsDialogOpen: (open: boolean) => void;
}) => {
  return (
    <Link
      to={`/sermons?series=${data.slug}`}
      onClick={() => setIsDialogOpen(false)}
    >
      <div className="flex items-center pb-1 pt-1  pl-2 space-x-4">
        <div>
          <FaLayerGroup size="20px" className={`${iconColor} dark:${darkIconColor}`} />
        </div>
        <div className="flex-grow min-w-0 leading-none">
          <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">
            {data.primary}
          </h2>
        </div>
      </div>
    </Link>
  );
};

const TopicResult = ({
  data,
  setIsDialogOpen,
}: {
  data: SearchType;
  setIsDialogOpen: (open: boolean) => void;
}) => {
  console.log("data");
  console.log(data);
  return (
    <Link
      to={`/sermons?topic=${data.slug}`}
      onClick={() => setIsDialogOpen(false)}
    >
      <div className="flex items-center  pb-1 pt-1  pl-2 space-x-4">
        <div>
          <MdFormatListBulleted size="20px" className={`${iconColor} dark:${darkIconColor}`} />
        </div>
        <div className="flex-grow min-w-0">
          <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">
            {data.primary}
          </h2>
        </div>
      </div>
    </Link>
  );
};

const ScriptureResult = ({
  data,
  setIsDialogOpen,
}: {
  data: SearchType;
  setIsDialogOpen: (open: boolean) => void;
}) => (
  <Link
    to={`/sermons?scripture=${data.slug}`}
    onClick={() => setIsDialogOpen(false)}
  >
    <div className="flex items-center pt-1  pb-1 pl-2 space-x-4">
      <div>
        <FaBookOpen size="20px" className={`${iconColor} dark:${darkIconColor}`} />
      </div>
      <div className="flex-grow min-w-0">
        <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">
          {data.primary}
        </h2>
      </div>
    </div>
  </Link>
);
export function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResult = SearchFetch<SearchType[]>(
    `fetchsearch?query=${searchTerm}`,
    "SearchData",
    false,
    isDialogOpen
  );
  console.log(searchResult.data);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    console.log("here");
    const detectSafari = () => {
      const userAgent = navigator.userAgent;
      const isChrome = userAgent.indexOf("Chrome") > -1;
      const isSafari = userAgent.indexOf("Safari") > -1;
      console.log(isSafari && !isChrome);
      return isSafari && !isChrome;
    };

    setIsSafari(detectSafari());
  }, []);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (
      isDialogOpen &&
      searchResult != undefined &&
      searchResult.data !== undefined
    ) {
      // Clear the previous timer
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      // Set a new timer
      timeoutId.current = setTimeout(() => {
        searchResult.refetch();
      }, 400); // 500ms delay
    }

    // Cleanup function
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [searchTerm, isDialogOpen, searchResult?.refetch]);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      console.log(vh);
      if (window.visualViewport) {
        const keyboardShown = window.visualViewport.height < window.innerHeight;
        setKeyboardVisible(keyboardShown);

        // Prevent scrolling when keyboard is open

        document.body.style.overflow = " relative hidden";
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const groupByCollection = (data: SearchType[]) => {
    return data.reduce((acc, item) => {
      const key = item.theType;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, SearchType[]>);
  };
  useEffect(() => {
    // Get the DOM element of the ScrollArea component
    const scrollAreaElement = scrollAreaRef.current;

    // Define the touchmove event handler
    const handleTouchMove = () => {
      if (searchInputRef.current) {
        (searchInputRef.current as any).blur();
      }
    };

    // Add the touchmove event listener to the ScrollArea element
    if (scrollAreaElement) {
      scrollAreaElement.addEventListener("touchmove", handleTouchMove);
    }

    // Remove the event listener when the component unmounts
    return () => {
      if (scrollAreaElement) {
        scrollAreaElement.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isDialogOpen, searchInputRef.current, scrollAreaRef.current]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-4 lg:h-6"
        
          >
            <FaSearch className='pr-1' size={15}></FaSearch>
			   Site
          </Button>
        </DialogTrigger>
        <div className="overflow-hidden">
          <DialogOverlay className="bg-slate-50 bg-opacity-50 fixed">
            <DialogContent className={"overflow-hidden top-72"}>
              <div className="sticky top-0 z-10">
                <DialogHeader>
                  <header className="flex items-center border-b pl-5">
                    <FaSearch className="text-primary"></FaSearch>
                    <input
                      ref={searchInputRef}
                      className="flex h-10 w-full rounded-md bg-transparent py-3 pr-5 pl-2 text-md outline-none  placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search Sermons,Topics, Series Ect..."
                      onChange={handleInputChange} // Use the handler here
                      value={searchTerm} // Control the input
                    ></input>
                  </header>
                </DialogHeader>
              </div>

              <ScrollArea ref={scrollAreaRef} className={"h-96"}>
                {Array.isArray(searchResult.data)
                  ? Object.entries(groupByCollection(searchResult.data)).map(
                      ([collection, items], index) => {
                        return (
                          <div key={index} ref={scrollAreaRef}>
                            <h2 ref={scrollAreaRef} className="text-md pl-4 pt-4 font-medium text-gray-600">
							{collection.charAt(0).toUpperCase() + collection.slice(1)}
                            </h2>{" "}
                            {/* This is the header for each type */}
                            {items.map((item, index) => {
								console.log(item);
                              let Component;
                              switch (item.theType) {
                                case "sermon":
                                  Component = SermonResult;
                                  break;
                                case "author":
                                  Component = AuthorResult;
                                  break;
                                case "series":
                                  Component = SeriesResult;
                                  break;
                                case "scripture":
                                  Component = ScriptureResult;
                                  break;
                                case "topic":
                                  Component = TopicResult;
                                  break;
                                default:
                                  Component = null;
                              }
                              return Component ? (
                                <Component
                                  key={index}
                                  data={item}
                                  setIsDialogOpen={setIsDialogOpen}
								
                                />
                              ) : null;
                            })}
                          </div>
                        );
                      }
                    )
                  : null}
              </ScrollArea>
            </DialogContent>
          </DialogOverlay>
        </div>
      </Dialog>
    </>
  );
}
export default Search;
