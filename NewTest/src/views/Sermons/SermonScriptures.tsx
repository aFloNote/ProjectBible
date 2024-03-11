import { Fetch } from "@/hooks/sermonhooks";
import { ScriptureType } from "@/types/sermon";

import { SiteImage } from "@/image";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";

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

  const { data: scriptsData } = Fetch<ScriptureType[]>(
    "pubfetchscriptures",
    "ScriptureData",
    false
  );
  useEffect(() => {
    if (scriptsData) {
      setItems(scriptsData.slice(0, 200));
    }
  }, [scriptsData]);
  const fetchMoreData = () => {
    if (scriptsData) {
      const newItems = scriptsData.slice(items.length, items.length + 10);

      setItems((prevItems) => [...prevItems, ...newItems]);

      if (items.length + 10 >= scriptsData.length) {
        setHasMoreItems(false);
      }
    }
  };

  const sortedScriptureData = scriptsData?.sort((a, b) => {
    return bibleOrder.indexOf(a.book) - bibleOrder.indexOf(b.book);
  });

  return (
    <div className="pb-16">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.8}
      >
        {sortedScriptureData?.map((script) => (
          <div className="pt-2 px-2" key={script.scripture_id}>
               <Link to={`/sermons?scripture=${script.slug}`}>
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center space-x-4">
                  {script.image_path !== "default" && (
                    <SiteImage
                      divClass="w-16 h-16 rounded-full"
                      ratio={1}
                      alt="Author Image"
                      source={
                        b2endpoint + encodeURIComponent(script.image_path)
                      }
                    />
                  )}
                  <h2 className="text-xl">{script.book}</h2>
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
export default Scriptures;
