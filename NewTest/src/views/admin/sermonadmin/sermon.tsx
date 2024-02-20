
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { Label } from "@/components/ui/label";
import { AuthImage } from "@/views/admin/imagedrop";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Fetch } from "@/hooks/sermonhooks";
import { AuthorSeries } from "@/views/admin/sermonadmin/author";
import { SeriesType, AuthorsType } from "@/types/sermon";
import { Separator } from "@/components/ui/separator";
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Sermon() {
  const { data: seriesData, error: seriesError } = Fetch<SeriesType[]>(
    "fetchseries",
    "SeriesData"
  );
  const { data: authorsData, error: authorsError } = Fetch<AuthorsType[]>(
    "fetchauthors",
    "AuthorData"
  );
  const selectedAuthor = useSelector(
    (state: RootState) => state.selected.selectedAuthor
  );
  const selectedSeries = useSelector(
    (state: RootState) => state.selected.selectedSeries
  );
  const [date, setDate] = React.useState<Date>()
  console.log("Selected Series:", selectedSeries);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  return (
    <div className="w-full pt-4">
  <h1 className="text-2xl font-semibold text-center pb-4">Sermons</h1>
  <div className="flex columns-2 justify-evenly">
    <div className="flex flex-col justify-center">
    <AuthorSeries
                items={authorsData}
                error={authorsError as Error}
                type="Author"
                nameKey="name"
                idKey="author_id"
                desc="ministry"
              />
    </div>
    <div className="flex flex-col justify-center">
    <div className="flex justify-end">
              <AuthorSeries
                items={seriesData}
                error={seriesError as Error}
                type="Series"
                nameKey="title"
                idKey="series_id"
                desc="description"
              />
            </div>
    </div>
  </div>
  <Separator />
  <div className="flex columns-2 justify-evenly pt-5">
  <div className="flex items-center space-x-4">
    <Label htmlFor="title"  className="font-medium">
      Title
    </Label>
    <Input className="" placeholder="Enter name" />
  </div>

  <div className="flex items-center space-x-4">
    <Label className="font-medium">
      Scripture
    </Label>
    <Input className="" placeholder="Enter scripture" />
  </div>
</div>
   
<div className="flex justify-evenly pt-5">
 
<Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  <div className="flex items-center space-x-4">
  <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
    <AuthImage onImageUpdate={handleImageUpdate} />
  </div>
  </div>
</div>
  

  
</div>
    

  


  );
}
export default Sermon;
