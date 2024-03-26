import { Fetch } from "@/hooks/sermonhooks";
import { ScriptureType } from "@/types/sermon";

import { SiteImage } from "@/image";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
  const navigate = useNavigate();
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
        .filter((result) => result.collection === "scriptures")
        .map((result) => result.document as ScriptureType);
      setItems(scriptsResults.slice(0, 200));
    } else {
      if (scriptsData) setItems(scriptsData.slice(0, 200));
    }
  }, [searchResults, scriptsData]);

  const fetchMoreData = () => {
    if (searchResults && searchResults.length > 0) {
      const newItems = searchResults
        .filter((result) => result.collection === "scriptures")
        .map((result) => result.document as ScriptureType)
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
	<div className="flex flex-col h-full pb-36 lg:pb-10">
	<ScrollArea className="flex-1 overflow-auto">
	  <InfiniteScroll
		dataLength={sortedScriptureData.length}
		next={fetchMoreData}
		hasMore={hasMoreItems}
		loader={<h4></h4>}
		scrollThreshold={0.8}
	  >
		<div className="pb-22 lg:pb-1 lg:flex lg:flex-wrap lg:h-auto lg:h-64 h-full ">
		  {items.map((scripture, index) => (
			<div
			  key={index}
			  onClick={() => {
				navigate(`/sermons?scripture=${scripture.slug}`);
			  }}
			  className="pt-2 px-2 lg:w-1/3 lg:px-15 "
			>
			  <Card>
				<div className="flex items-center pt-1 pb-1 lg:pt-4 px-5 space-x-2 lg:justify-center">
				 
				  <div>
					  
					<SiteImage
					  divClass="w-12 h-12 lg:h-32 lg:w-32 rounded-full lg:mx-auto"
					  ratio={1}
					  alt="Topic Image"
					  source={
						b2endpoint +
						encodeURIComponent(scripture.image_path)
					  }
					/>
				  </div>
				  <div className="flex-grow min-w-0 lg:hidden">
					<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden leading-none text-lg">
					  {scripture.book}
					</h2>
				
				  </div>
				</div>
				<div className=" lg:border-b lg:text-gray-600 lg:pt-2 "></div>

				<div className="lg:flex lg:justify-center lg:pt-2 lg:pb-2">
				  <div className="flex flex-col hidden lg:block">
					
					<h2 className="lg:text-xl lg:text-center hidden lg:block lg:leading-none">
					  {scripture.book}
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
export default Scriptures;
