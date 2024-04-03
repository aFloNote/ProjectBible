"use client";
import * as React from "react";
import {  ChevronsUpDown } from "lucide-react";
import {  CheckIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
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
import { setSelectedSeries } from '@/redux/sermonAdminSelector'; // replace with the actual path to your actions
import { Fetch } from "@/hooks/sermonhooks";
import { SeriesType } from "@/types/sermon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";



export function SelectSeries() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const selectedSeries = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSeries
  );
  React.useEffect(() => {
    if (selectedSeries !== null) {
      setSelectedId(selectedSeries.slug);
    }
    else setSelectedId("");
  }, [selectedSeries]);

  const dispatch = useDispatch();

// inside your onSelect function


const { data: seriesData, error } = Fetch<SeriesType[]>(
    "fetchseries",
    "SeriesData"
  );


  if (!seriesData || error ||  seriesData===undefined || seriesData.length===0) {
  
    return <div>Error Finding Series</div>
  }
  else {

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
         
            role="combobox"
            aria-expanded={open}
			className='h-5 w-[200px] justify-between bg-white text-gray-500 font-normal border-t-5 dark:bg-background dark:text-white'
            
          >
			<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedId
               ? seriesData.find((series) => series.slug === selectedId)?.title
               : `Select Series...`}
			   </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <ScrollArea className='h-72 w-46 rounded-md border pointer-events-auto'>
          <Command>
            <CommandInput placeholder={`Search series...`} />
            <CommandEmpty>No series found.</CommandEmpty>
            <CommandGroup>
              {seriesData.map((series) => (
                <CommandItem
                  key={series.slug}
                  value={series.slug}
                  onSelect={(currentValue) => {
               
                 
              
                
                 
                    setSelectedId(currentValue === selectedId ? "" : currentValue)
                 
                    setOpen(false)
               
                      dispatch(setSelectedSeries(currentValue !== selectedId ? series : null));
                  
                  }}
                >
					  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === series.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
						
                  {series.title}
				
                
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }
}
