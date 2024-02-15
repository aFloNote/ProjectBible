  "use client";
  import * as React from "react";
  import {  ChevronsUpDown } from "lucide-react";
  import {  CheckIcon } from "@radix-ui/react-icons"
  import { FetchAuthor } from '@/hooks/sermonhooks';
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

  export function SelectAuthor() {
    const { data: authorsData, error, isLoading } = FetchAuthor();
    const [open, setOpen] = React.useState(false);
    const [author_id, setID] = React.useState("");

  console.log(authorsData);
    
  if (!authorsData || authorsData===undefined || error || isLoading) {
      return <div>Error Finding Authors</div>
  }
  else{
    return (
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {author_id
            ? authorsData.find((authorData) => authorData.author_id.toString() === author_id)?.name
            : "Select Author..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Authors..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {authorsData.map((authorData) => (
              <CommandItem
                key={authorData.author_id}
                value={authorData.author_id.toString()}
                onSelect={(currentValue) => {
                  console.log(currentValue)
                  console.log(author_id)
                  
                  setID(currentValue=== author_id ?"" : currentValue)
                  setOpen(false)
                }}
              >
                {authorData.name}
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    author_id === authorData.author_id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
             
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    );
                  }
  }
