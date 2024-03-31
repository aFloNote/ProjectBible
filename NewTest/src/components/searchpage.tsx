import { SearchPageFetch } from "@/hooks/sermonhooks";
import { useState, useEffect, useRef } from "react";
import { setSearchResults, setSearch } from "@/redux/searchselector";
import { SearchResult } from "@/types/sermon";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { DatePickerWithRange } from "./ui/daterangepicker";
import { DateRange } from "react-day-picker";


export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [fromDate, setFromDate] = useState<number| undefined>(undefined);
  const [toDate, setToDate] = useState<number | undefined>(undefined);
  const location = useLocation();

  let pageName = "";
  const currentPath = location.pathname;
  pageName = currentPath.substring(1); // remove the leading slash
  useEffect(() => {
	setInputValue("");
  }, [location]);
  // If the path is nested, you might want to get only the first part
  if (pageName.includes("/")) {
    pageName = pageName.split("/")[0];

  }
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
	console.log(pageName)
	if (pageName !=="sermons"){
		setFromDate(undefined);
		setToDate(undefined);
	}
    const seriesSlug = queryParams.get("series");
    const topicSlug = queryParams.get("topic");
    const scriptureSlug = queryParams.get("scripture");
    const authorSlug = queryParams.get("author");
    if (authorSlug) {
      const words = authorSlug.split("-");
      const authorName = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setSearchCriteria("Author: " + authorName);
    } else if (seriesSlug) {
      const words = seriesSlug.split("-");
      const seriesName = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setSearchCriteria("Series: " + seriesName);
    } else if (topicSlug){
	const words = topicSlug.split('-');
	const topicName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	setSearchCriteria("Topic: " + topicName);
	}
    else if (scriptureSlug){
		const words = scriptureSlug.split('-');
	const scriptName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	setSearchCriteria("Scripture: " + scriptName);
	}
    
    else
	
      setSearchCriteria(pageName.charAt(0).toUpperCase() + pageName.slice(1));




    if (location.pathname !== "/search") {
      dispatch(setSearchResults([]));
    }
  }, [location, dispatch]);

  const searchResult = SearchPageFetch<SearchResult[]>(
    `fetchsearchpage?query=${searchTerm}&collection=${pageName}&fromDate=${fromDate}&toDate=${toDate}`,
    "SearchTopicData"
  );

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
	if (timeoutId.current) {
	  clearTimeout(timeoutId.current);
	}
  
	if (inputValue === "") {
	  dispatch(setSearchResults([]));
	  return;
	}
  
	if (searchResult) {
	  searchResult.refetch().then(() => {
		timeoutId.current = setTimeout(() => {
		  if (searchResult.data) {
			dispatch(setSearchResults(searchResult.data));
		  } else {
			dispatch(setSearchResults([{ collection: "", document: "" }]));
		  }
		}, 200);
	  });
	} else {
	  dispatch(setSearchResults([]));
	}
  
	// Cleanup function
	return () => {
	  if (timeoutId.current) {
		clearTimeout(timeoutId.current);
	  }
	};
  }, [inputValue, searchResult?.refetch, dispatch, searchResult.data]);

  const handleDateChange = (date: DateRange | undefined) => {
	if (date?.from && date?.to) {
	  const fromMountainTime = new Date(date.from.toLocaleString("en-US", { timeZone: "America/Denver" }));
	  const toMountainTime = new Date(date.to.toLocaleString("en-US", { timeZone: "America/Denver" }));
	  const fromUnix = Math.floor(fromMountainTime.getTime() / 1000);
	  const toUnix = Math.floor(toMountainTime.getTime() / 1000);
	  setFromDate(fromUnix);
	  setToDate(toUnix);
	  dispatch(setSearch(fromUnix + "-" + toUnix));
	} else if (date?.from) {
	  const fromMountainTime = new Date(date.from.toLocaleString("en-US", { timeZone: "America/Denver" }));
	  const fromUnix = Math.floor(fromMountainTime.getTime() / 1000);
	  setFromDate(fromUnix);
	  setToDate(fromUnix);
	  dispatch(setSearch(fromUnix + "-" + fromUnix));
	} else {
	  setFromDate(undefined);
	  setToDate(undefined);
	}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	setInputValue(e.target.value);
	dispatch(setSearch(e.target.value));
  };
  
  useEffect(() => {
	setSearchTerm(inputValue);
	if (inputValue === "") {
	  dispatch(setSearchResults([]));
	}
  }, [inputValue, dispatch]);

  return (
	<div className="relative bg-slate-50 dark:bg-background">
    <div className="flex pt-1 items-center">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={searchCriteria}
        className="pl-10 border-border bg-white dark:bg-background pr-2 text-lg" // Add some padding to prevent the text from overlapping the icon
      />
      <FaSearch size={20} className={`absolute left-2 top-1/2 transform -translate-y-2 ${inputValue ? 'text-primary' : 'text-gray-500/50'}`} />
      {pageName === "sermons" && <DatePickerWithRange className={fromDate !== undefined && toDate !== undefined ? 'pl-2 text-primary dark:text-white' : 'pl-2 text-gray-500/50'}  onDateChange={handleDateChange} />}
    </div>
  </div>
  );
}

export default SearchPage;
