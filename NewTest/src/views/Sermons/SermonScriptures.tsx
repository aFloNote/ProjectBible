import { Fetch } from "@/hooks/sermonhooks";
import { ScriptureType } from "@/types/sermon";

import { SiteImage } from "@/image";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";


import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; 
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function Scriptures() {
	
  const bibleOrder = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
    "Various Scriptures",
  ];
 
  const [items, setItems] = useState<ScriptureType[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
 
  const searchResults = useSelector((state: RootState) => state.search.results);
  
  const { data: scriptsData } = Fetch<ScriptureType[]>(
    "pubfetchscriptures",
    "ScriptureData",
    false
  );
  const searchTerm = useSelector((state: RootState) => state.search.input);
  useEffect(() => {
	
	if (searchResults && searchResults.length > 0 && searchTerm !== "") {
	  const scriptsResults = searchResults
		.filter(result => result.collection === 'scriptures')
		.map(result => result.document as ScriptureType);
	  setItems(scriptsResults.slice(0, 200));
	} else {
	  if(scriptsData)
	  setItems(scriptsData.slice(0, 200));
	}
  }, [searchResults, scriptsData]);
  
  const fetchMoreData = () => {
	if (searchResults && searchResults.length > 0) {
	  const newItems = searchResults
		.filter(result => result.collection === 'scriptures')
		.map(result => result.document as ScriptureType)
		.slice(items.length, items.length + 10);
  
	  setItems((prevItems) => [...prevItems, ...newItems]);
  
	  if (items.length + 10 >= searchResults.length) {
		setHasMoreItems(false);
	  }
	} else {
	  if (!scriptsData) return;
	  const newItems = scriptsData.slice(items.length, items.length + 10);
	  setItems((prevItems) => [...prevItems, ...newItems]);
  
	  if (items.length + 10 >= scriptsData.length) {
		setHasMoreItems(false);
	  }
	}
  };

  const sortedScriptureData = items?.sort((a, b) => {
    return bibleOrder.indexOf(a.book) - bibleOrder.indexOf(b.book);
  });

  return (
    <div className="flex flex-col pb-24 lg:pb-10 h-full">
		<ScrollArea className="flex-1 overflow-auto">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4></h4>}
        scrollThreshold={0.8}
      >
		<div className="lg:flex lg:flex-wrap lg:h-auto lg:h-64">
        {sortedScriptureData?.map((script) => (
          <div className="pt-2 px-2 lg:w-1/3 lg:px-15" key={script.scripture_id}>
		  <Link to={`/sermons?scripture=${script.slug}`}>
			<Card>
			  <CardContent className="pt-5 lg:px-10">
				<div className="flex lg:flex-col items-center space-x-4">
				  {script.image_path !== "default" && (
					<SiteImage
					  divClass="w-16 h-16 lg:h-32 lg:w-32 rounded-full"
					  ratio={1}
					  alt="Scripture Image"
					  source={
						b2endpoint + encodeURIComponent(script.image_path)
					  }
					/>
				  )}
				  <h2 className="text-xl lg:hidden">{script.book}</h2>
				</div>
				<div className=' lg:border-b lg:text-gray-600 lg:pt-2'></div>
				  <div className="lg:flex lg:justify-center lg:pt-2">
				  <h2 className="lg:text-xl lg:text-center hidden lg:block">{script.book}</h2>
				  </div>
			  </CardContent>
			</Card>
		  </Link>
		</div>
        ))}
		  </div>
      </InfiniteScroll>
	  </ScrollArea>
    </div>
  );
}
export default Scriptures;
