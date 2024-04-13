"use client";
import {useEffect,useState} from "react";
import {  ChevronsUpDown } from "lucide-react";
import {  CheckIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import { SermonFullType } from "@/types/sermon";
import { Fetch } from "@/hooks/sermonhooks";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAuthor, setSelectedScripture, setSelectedSeries, setSelectedTopics,setSelectedSermon } from '@/redux/sermonAdminSelector'; // replace with the actual path to your actions
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/redux/store";

export function SelectSermon() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const { data: sermonData} = Fetch<SermonFullType[]>(
    "fetchsermons",
    "SermonData"
  );
  const selectedSermon = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSermon
  );
  useEffect(() => {
    if (selectedSermon !== null) {
      setSelectedId(selectedSermon.slug);
    }
    else setSelectedId("");
  }, [selectedSermon]);
  const dispatch = useDispatch();

    
    if (!sermonData||  sermonData===undefined || sermonData.length===0) {
     
      return <div>Error Finding Sermon</div>
    }
    else {
	console.log(sermonData);
    return (
     <>
        <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
		  variant='outline'
          role="combobox"
          aria-expanded={open}
          className='h-5 w-full'
        >
          {selectedId
            ? sermonData.find((sermon) => sermon.SermonType.slug === selectedId)?.SermonType.title
            : `Select Sermon...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <ScrollArea className='h-72 w-46 rounded-md border'>
        <Command>
          <CommandInput placeholder={`Search Sermon...`} />
          <CommandEmpty>No Sermon found.</CommandEmpty>
          <CommandGroup>
            {
			sermonData.map((sermon) => (
              <CommandItem
                key={sermon.SermonType.slug}
                value={sermon.SermonType.slug}
                onSelect={(currentValue) => {
                  setSelectedId(currentValue === selectedId ? "" : currentValue);
                  setOpen(false);
                  dispatch(setSelectedAuthor(currentValue !== selectedId ? sermon.AuthorType : null));
                  dispatch(setSelectedSeries(currentValue !== selectedId ? sermon.SeriesType : null));
                  dispatch(setSelectedSermon(currentValue !== selectedId ? sermon.SermonType : null));
                  dispatch(setSelectedScripture(currentValue !== selectedId ? sermon.ScriptureType : null));
                  dispatch(setSelectedTopics(currentValue !== selectedId ? sermon.TopicType : null));
                }}
              >
				  <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === sermon.SermonType.slug ? "opacity-100" : "opacity-0"
                  )}
                />
				
                {sermon.SermonType.title}
			
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
        </ScrollArea>
      </PopoverContent>
    </Popover>
     </>
  
    );
  }                                   
  
}
