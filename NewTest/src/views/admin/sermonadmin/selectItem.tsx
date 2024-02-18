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

 
  
  
  interface SelectProps {
    items: any[];
    error: Error | null;
    type: string;
    idKey: string;
    nameKey: string;
    onSelect: (item: any) => void;
  }
  
  export function SelectItem({  items, error, type, idKey, nameKey }: SelectProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState("");
    if (!items || error ||  items===undefined || items.length===0) {
      console.log('asdfsd'+error)
      return <div>Error Finding {type}</div>
    }
    else {
      console.log(items)
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedId
                ? items.find((item) => item[idKey].toString() === selectedId)?.[nameKey]
                : `Select ${type}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search ${type}...`} />
              <CommandEmpty>No {type} found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item[idKey]}
                    value={item[idKey].toString()}
                    onSelect={(currentValue) => {
                 
                    console.log(currentValue, selectedId, item[idKey], item[nameKey])
                    const currentId = typeof item[idKey] === 'number' ? parseInt(currentValue, 10) : currentValue;
                  
                  
                      setSelectedId(currentId === selectedId ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {item[nameKey]}
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedId === item[idKey].toString() ? "opacity-100" : "opacity-0"
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
