import { Dialog, DialogContent, DialogTrigger,DialogOverlay } from "@/components/ui/dialog";
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
import {Link} from "react-router-dom";
import { MdFormatListBulleted } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";
type SearchResult = {
  collection: string;
  document: SermonType | AuthorType | SeriesType | TopicType | ScriptureType;
};

// Define your components
const SermonResult = ({ data,setIsDialogOpen }: { data: SermonType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermonlistening/${data.slug}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center border-b pb-4 pt-4 pl-2 space-x-4">
	<div>
	<TbPodium size='30px' className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0 leading-none">
                    <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-md">	
                        {data.title}
                    </h2>
					<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm">	
                        {data.scripture}
                    </p>
                </div>
	<div className="border-b text-gray-300"></div>
	</div>
	</Link>
);

const AuthorResult = ({ data,setIsDialogOpen }: { data: AuthorType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermons?series=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center border-b pb-4 pt-4  pl-2 space-x-4">
	<div>
	<IoPersonCircleOutline size='30px'  className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0 leading-none">
                    <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-md">	
                        {data.name}
                    </h2>
					<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm">	
                        {data.ministry}
                    </p>
                </div>
	<div className="border-b text-gray-300"></div>
	</div>
	</Link>
);

const SeriesResult = ({ data,setIsDialogOpen}: { data: SeriesType, setIsDialogOpen: (open: boolean) => void }) => {
    console.log(data); // Add this line
    return (
        <Link to={`/sermons?series=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
            <div className="flex items-center border-b pb-4 pt-4  pl-2 space-x-4">
                <div>
                    <FaLayerGroup size='30px' className='text-blue-500'/> 
                </div>
                <div className="flex-grow min-w-0 leading-none">
                    <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-md">	
                        {data.title}
                    </h2>
					<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm">	
                        {data.desc}
                    </p>
                </div>
                <div className="border-b text-gray-300"></div>
            </div>
        </Link>
    );
};

const TopicResult = ({ data, setIsDialogOpen }: { data: TopicType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermons?topic=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center border-b pb-4 pt-4  pl-2 space-x-4">
	<div>
	<MdFormatListBulleted size='30px' className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0">
	<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-md">	
	{data.name}
	</h2>
	</div>
	<div className="border-b text-gray-300"></div>
	</div>
</Link>
);




const ScriptureResult = ({ data, setIsDialogOpen }: { data: ScriptureType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermons?sciprture=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center border-b pt-4  pb-4 pl-2 space-x-4">
	<div>
	<FaBookOpen size='30px' className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0">
	<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-md">	
	{data.book}
	</h2>
	</div>
	<div className="border-b text-gray-300"></div>
	</div>
</Link>
);
export function Search() {
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
	
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
		
      <DialogTrigger asChild>
        <Button
          className="shadow-none outline outline-1 outline-gray-500/50 h-4"
          variant="outline"
        >
          <FaSearch className="gray-500/50"></FaSearch>
          <span className="pl-1">Search...</span>
        </Button>
      </DialogTrigger>
	  <DialogOverlay className='fixed inset-0 bg-slate-50 bg-opacity-50'>
      <DialogContent className='px-0 min-h-80'>
	  	<div>
        <div className="flex items-center border-b pl-5">
          <FaSearch className="text-muted-foreground"></FaSearch>
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 pl-2 text-md outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search Sermons,Topics, Series Ect..."
            onChange={handleInputChange} // Use the handler here
            value={searchTerm} // Control the input
          ></input>
        </div>
        <div>
          <ScrollArea className='px-0 pt-4 pl-2'>
            {Array.isArray(searchResult.data)
              ? searchResult.data.map((item, index) => {
                  switch (item.collection) {
                    case "sermons":
                      return (
                        <SermonResult
                          key={index}
                          data={item.document as SermonType}
						  setIsDialogOpen={setIsDialogOpen}
                        />
                      );
                    case "authors":
                      return (
                        <AuthorResult
                          key={index}
                          data={item.document as AuthorType}
						  setIsDialogOpen={setIsDialogOpen}
                        />
                      );
                    case "series":
                      return (
                        <SeriesResult
                          key={index}
                          data={item.document as SeriesType}
						  setIsDialogOpen={setIsDialogOpen}
                        />
                      );
					  case "scriptures":
						return (
						  <ScriptureResult
							key={index}
							data={item.document as ScriptureType}
							setIsDialogOpen={setIsDialogOpen}
						  />
						);
                    case "topics":
                      return (
                        <TopicResult
                          key={index}
                          data={item.document as TopicType}
						  setIsDialogOpen={setIsDialogOpen}
                        />
                      );
                   
                    default:
                      return null;
                  }
                })
              : null}
          </ScrollArea>
        </div>
		</div>
      </DialogContent>
	  </DialogOverlay>
	 
    </Dialog>

  );
}

export default Search;
