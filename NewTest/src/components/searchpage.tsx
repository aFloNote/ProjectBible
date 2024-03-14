
import { SearchFetch } from "@/hooks/sermonhooks";
import { useState, useEffect, useRef } from "react";
import {
  AuthorType,
  SermonType,
  SeriesType,
  TopicType,
  ScriptureType,
} from "@/types/sermon";
import { Input } from "@/components/ui/input"
type SearchResult = {
  collection: string;
  document: SermonType | AuthorType | SeriesType | TopicType | ScriptureType;
};

// Define your compo

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const searchResult = SearchFetch<SearchResult[]>(
    `fetchsearch?query=${searchTerm}`,
    "SearchData",
    false,
    isDialogOpen
  );

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
	if (isDialogOpen && searchResult != undefined && searchResult.data !== undefined) {
	  // Clear the previous timer
	  if (timeoutId.current) {
		clearTimeout(timeoutId.current);
	  }
  
	  // Set a new timer
	  timeoutId.current = setTimeout(() => {
		searchResult.refetch();
	  }, 100); // 500ms delay
	}
  
	// Cleanup function
	return () => {
	  if (timeoutId.current) {
		clearTimeout(timeoutId.current);
	  }
	};
  }, [searchTerm, isDialogOpen, searchResult?.refetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  console.log(searchResult);
  return (
	<Input/>
    
  );
}

export default SearchPage;
