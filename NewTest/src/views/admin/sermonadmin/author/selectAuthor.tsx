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
import { setSelectedAuthor} from '@/redux/sermonAdminSelector'; // replace with the actual path to your actions
import { Fetch } from "@/hooks/sermonhooks";
import { AuthorType } from "@/types/sermon";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";



export function SelectAuthor() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const selectedAuthor = useSelector(
    (state: RootState) => state.sermonAdmin.selectedAuthor
  );
  React.useEffect(() => {
    if (selectedAuthor !== null) {
      setSelectedId(selectedAuthor.slug);
    }
    else setSelectedId("");
  }, [selectedAuthor]);

  const dispatch = useDispatch();

// inside your onSelect function


const { data: authorsData, error } = Fetch<AuthorType[]>(
    "fetchauthors",
    "AuthorData"
  );


  if (!authorsData || error ||  authorsData===undefined || authorsData.length===0) {
 
    return <div>Error Finding Authors</div>
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
            {selectedId
               ? authorsData.find((author) => author.slug === selectedId)?.name
               : `Select Author...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <ScrollArea>
          <Command>
            <CommandInput placeholder={`Search author...`} />
            <CommandEmpty>No author found.</CommandEmpty>
            <CommandGroup>
              {authorsData.map((author) => (
                <CommandItem
                  key={author.slug}
                  value={author.slug}
                  onSelect={(currentValue) => {
                    setSelectedId(currentValue === selectedId ? "" : currentValue)
                   
                    setOpen(false)
               
                    dispatch(setSelectedAuthor(currentValue !== selectedId ? author : null));
                  
                  }}
                >
                  {author.name}
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === author.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
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
