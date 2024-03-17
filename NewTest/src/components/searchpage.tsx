import { SearchPageFetch } from "@/hooks/sermonhooks";
import { useState, useEffect, useRef } from "react";
import { setSearchResults, setSearch } from "@/redux/searchselector";
import { SearchResult } from "@/types/sermon";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";


export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("");
  const location = useLocation();

  let pageName = "";
  const currentPath = location.pathname;
  pageName = currentPath.substring(1); // remove the leading slash

  // If the path is nested, you might want to get only the first part
  if (pageName.includes("/")) {
    pageName = pageName.split("/")[0];
  }
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
	
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
    `fetchsearchpage?query=${searchTerm}&collection=${pageName}`,
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
		}, 400);
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
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={searchCriteria}
        className="pl-10" // Add some padding to prevent the text from overlapping the icon
      />
      <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
}

export default SearchPage;
