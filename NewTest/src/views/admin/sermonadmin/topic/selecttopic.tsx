"use client";
import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { CheckIcon } from "@radix-ui/react-icons";
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
import { useDispatch } from "react-redux";
import { setSelectedTopics } from "@/redux/sermonAdminSelector"; // replace with the actual path to your actions
import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function SelectTopic() {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedTopics = useSelector(
    (state: RootState) => state.sermonAdmin.selectedTopics
  );
  useEffect(() => {
	
	if (Array.isArray(selectedTopics)) {
	  setSelectedIds(selectedTopics.map((topic) => topic.slug));
	} else {
		
	  setSelectedIds([]);
	}
  }, [selectedTopics]);

  const dispatch = useDispatch();

  const { data: topicData, error } = Fetch<TopicType[]>(
    "fetchtopics",
    "TopicData"
  );

  if (!topicData || error || topicData === undefined || topicData.length === 0) {
    return <div>Error Finding topic</div>;
  } else {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className="h-5 w-[200px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
          >
			<div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedIds.length > 0
              ? selectedIds.map((id) =>
                  topicData.find((topic) => topic.slug === id)?.name
                ).join(", ")
              : `Select Topics...`}
			  </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <ScrollArea className="h-72 w-46 rounded-md border">
            <Command>
              <CommandInput placeholder={`Search topics...`} />
              <CommandEmpty>No Topics found.</CommandEmpty>
              <CommandGroup>
                {topicData.map((topic) => (
                  <CommandItem
                    key={topic.slug}
                    value={topic.slug}
                    onSelect={(currentValue) => {
                      const isSelected = selectedIds.includes(currentValue);
                      setSelectedIds((prevSelectedIds) =>
                        isSelected
                          ? prevSelectedIds.filter((id) => id !== currentValue)
                          : [...prevSelectedIds, currentValue]
                      );
                      //setOpen(false);
					  dispatch(
						setSelectedTopics(
						  isSelected
							? selectedTopics && Array.isArray(selectedTopics)
							  ? selectedTopics.filter((topic) => topic.slug !== currentValue)
							  : []
							: Array.isArray(selectedTopics)
							? [...selectedTopics, topic]
							: [topic]
						)
					  );
                    }}
                  >
                    {topic.name}
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(topic.slug)
                          ? "opacity-100"
                          : "opacity-0"
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