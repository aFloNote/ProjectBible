import { Dialog, DialogContent, DialogTrigger,DialogOverlay,DialogHeader } from "@/components/SearchDialog";
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
	<div className="flex items-center pb-1 pt-1 pl-2 space-x-4">
	<div>
	<TbPodium size='20px' className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0 leading-none">
                    <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">	
                        {data.title}
                    </h2>
					<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-xs md:text-sm">	
                        {data.scripture}
                    </p>
                </div>
	
	</div>
	</Link>
);

const AuthorResult = ({ data,setIsDialogOpen }: { data: AuthorType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermons?author=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center  pb-1 pt-1  pl-2 space-x-4">
	<div>
	<IoPersonCircleOutline size='20px'  className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0 leading-none">
                    <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">	
                        {data.name}
                    </h2>
					<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-xs md:text-sm">	
                        {data.ministry}
                    </p>
                </div>

	</div>
	</Link>
);

const SeriesResult = ({ data,setIsDialogOpen}: { data: SeriesType, setIsDialogOpen: (open: boolean) => void }) => {
   
    return (
        <Link to={`/sermons?series=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
            <div className="flex items-center pb-1 pt-1  pl-2 space-x-4">
                <div>
                    <FaLayerGroup size='20px' className='text-blue-500'/> 
                </div>
                <div className="flex-grow min-w-0 leading-none">
                    <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">	
                        {data.title}
                    </h2>
					<p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-600 text-xs md:text-md">	
                        {data.description}
                    </p>
                </div>
               
            </div>
        </Link>
    );
};

const TopicResult = ({ data, setIsDialogOpen }: { data: TopicType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermons?topic=${data.slug}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center  pb-1 pt-1  pl-2 space-x-4">
	<div>
	<MdFormatListBulleted size='20px' className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0">
	<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">	
	{data.name}
	</h2>
	</div>
	
	</div>
</Link>
);




const ScriptureResult = ({ data, setIsDialogOpen }: { data: ScriptureType, setIsDialogOpen: (open: boolean) => void }) => (
	<Link to={`/sermons?scripture=${data.book}`} onClick={() => setIsDialogOpen(false)}>
	<div className="flex items-center pt-1  pb-1 pl-2 space-x-4">
	<div>
	<FaBookOpen size='20px' className='text-blue-500'/> 
	</div>
	<div className="flex-grow min-w-0">
	<h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-sm md:text-md">	
	{data.book}
	</h2>
	</div>
	
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
	  }, 400); // 500ms delay
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
  const groupByCollection = (data: SearchResult[]) => {
	return data.reduce((acc, item) => {
	  const key = item.collection;
	  if (!acc[key]) {
		acc[key] = [];
	  }
	  acc[key].push(item);
	  return acc;
	}, {} as Record<string, SearchResult[]>);
  };
  
  return (
	
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
		
      <DialogTrigger asChild>
        <Button
          className="shadow-none outline outline-1 outline-gray-500/50 h-4 lg:h-6"
          variant="outline"
        >
          <FaSearch className="gray-500/50"></FaSearch>
          <span className="pl-1"></span>
        </Button>
      </DialogTrigger>
	  <DialogOverlay className='bg-slate-50 bg-opacity-50'>
      <DialogContent className='px-0 h-96 overflow-auto'>
		<DialogHeader className='bg-background'>
		<header className="flex items-center border-b pl-5">
          <FaSearch className="text-muted-foreground"></FaSearch>
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 pl-2 text-md outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search Sermons,Topics, Series Ect..."
            onChange={handleInputChange} // Use the handler here
            value={searchTerm} // Control the input
          ></input>
        </header>
		</DialogHeader>
	  	<div className='pb-44 md:pb-0'>
       
        <div className=''>
      
		{Array.isArray(searchResult.data)
      ? Object.entries(groupByCollection(searchResult.data)).map(([collection, items], index) => {
          return (
            <div key={index}>
              <h2 className='text-md pl-4 pt-4 font-medium text-gray-600'>{collection}</h2> {/* This is the header for each type */}
              {items.map((item, index) => {
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
				})}
				</div>
			  );
			})
              : null}
      
        </div>
		</div>
      </DialogContent>
	  </DialogOverlay>
	 
    </Dialog>

  );
}

export default Search;
