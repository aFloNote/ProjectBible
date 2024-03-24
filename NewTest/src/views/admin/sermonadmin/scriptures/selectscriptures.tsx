"use client";
import * as React from "react";
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
import { setSelectedScripture } from "@/redux/sermonAdminSelector"; // replace with the actual path to your actions
import { Fetch } from "@/hooks/sermonhooks";
import { ScriptureType } from "@/types/sermon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function SelectScripture() {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const selectedScripture = useSelector(
    (state: RootState) => state.sermonAdmin.selectedScripture
  );
  React.useEffect(() => {
    if (selectedScripture !== null) {
      setSelectedId(selectedScripture.slug);
    } else setSelectedId("");
  }, [selectedScripture]);

  const dispatch = useDispatch();

  // inside your onSelect function
  const bibleOrder = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
    "Various Scriptures",
  ];

  const { data: scriptureData, error } = Fetch<ScriptureType[]>(
    "fetchscriptures",
    "ScriptureData"
  );

  const sortedScriptureData = scriptureData?.sort((a, b) => {
    return bibleOrder.indexOf(a.book) - bibleOrder.indexOf(b.book);
  });
  if (
    !scriptureData ||
    error ||
    scriptureData === undefined ||
    scriptureData.length === 0
  ) {
    return <div>Error Finding scripture</div>;
  } else {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
          
            role="combobox"
            aria-expanded={open}
			className='h-5 w-[200px] justify-between bg-white text-gray-500 font-normal border-t-5 dark:bg-background dark:text-white'
          >
            {selectedId && selectedScripture
              ? sortedScriptureData?.find(
                  (scripture) => scripture.slug === selectedId
                )?.book
              : `Select Book...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <ScrollArea className="h-72 w-48 rounded-md border">
            <Command>
              <CommandInput placeholder={`Search scripture...`} />
              <CommandEmpty>No scripture found.</CommandEmpty>
              <CommandGroup>
                {scriptureData.map((scripture) => (
                  <CommandItem
                    key={scripture.slug}
                    value={scripture.slug}
                    onSelect={(currentValue) => {
                      console.log(currentValue, selectedId);
                      setSelectedId(
                        currentValue === selectedId ? "" : currentValue
                      );
                      console.log(selectedId);
                      setOpen(false);

                      dispatch(
                        setSelectedScripture(
                          currentValue !== selectedId ? scripture : null
                        )
                      );
                    }}
                  >
                    {scripture.book}
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedId === scripture.slug
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
