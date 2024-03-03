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
import { setSelectedTopic } from '@/redux/sermonAdminSelector'; // replace with the actual path to your actions
import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";
import { ScrollArea } from "@/components/ui/scroll-area"





export function SelectTopic() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");


  const dispatch = useDispatch();

// inside your onSelect function


const { data: topicData, error } = Fetch<TopicType[]>(
    "fetchtopics",
    "TopicData"
  );


  if (!topicData || error ||  topicData===undefined || topicData.length===0) {
  
    return <div>Error Finding topic</div>
  }
  else {

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] pl-0"
          >
            {selectedId
               ? topicData.find((topic) => topic.slug === selectedId)?.name
               : `Select topic...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <ScrollArea>
          <Command>
            <CommandInput placeholder={`Search topic...`} />
            <CommandEmpty>No Topic found.</CommandEmpty>
            <CommandGroup>
              {topicData.map((topic) => (
                <CommandItem
                  key={topic.slug}
                  value={topic.slug}
                  onSelect={(currentValue) => {
               
                 
              
                
                    console.log(currentValue,selectedId)
                    setSelectedId(currentValue === selectedId ? "" : currentValue)
                    console.log(selectedId)
                    setOpen(false)
               
                      dispatch(setSelectedTopic(currentValue !== selectedId ? topic : null));
                  
                  }}
                >
                  {topic.name}
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === topic.slug ? "opacity-100" : "opacity-0"
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
