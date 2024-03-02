"use client";
import * as React from "react";
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
import { useDispatch } from 'react-redux';
import { setSelectedAuthor, setSelectedSeries } from '@/redux/sermonAdminSelector'; // replace with the actual path to your actions





export function SelectSermon() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const { data: sermonData, error: sermonError, isLoading: sermonIsLoading } = Fetch<SermonFullType[]>(
    "fetchsermons",
    "SermonData"
  );

  const dispatch = useDispatch();

// inside your onSlect function
    console.log(sermonData)
    
    if (!sermonData||  sermonData===undefined || sermonData.length===0) {
     
      return <div>Error Finding Sermon</div>
    }
    else {
    return (
     <>
        <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] pl-0"
        >
          {selectedId
            ? sermonData.find((sermon) => sermon.SermonType.sermon_id === selectedId)?.SermonType.title
            : `Select Sermon...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search Sermon...`} />
          <CommandEmpty>No Sermon found.</CommandEmpty>
          <CommandGroup>
            {sermonData.map((sermon) => (
              <CommandItem
                key={sermon.SermonType.sermon_id}
                value={sermon.SermonType.sermon_id}
                onSelect={(currentValue) => {
                  setSelectedId(currentValue === selectedId ? "" : currentValue);
                  setOpen(false);
                  dispatch(setSelectedAuthor(currentValue !== selectedId ? sermon.AuthorType : null));
                  dispatch(setSelectedSeries(currentValue !== selectedId ? sermon.SeriesType : null));
                }}
              >
                {sermon.SermonType.title}
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === sermon.SermonType.sermon_id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
     </>
  
    );
  }                                   
  
}
