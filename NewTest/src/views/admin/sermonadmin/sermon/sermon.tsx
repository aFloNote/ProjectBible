import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { Label } from "@/components/ui/label";
import { AuthAudio } from "@/views/admin/audiodrop";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { EditSermon } from "@/views/admin/sermonadmin/sermon/editsermon";
import { SelectSermon } from "@/views/admin/sermonadmin/sermon/selectSermon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useQueryClient } from "react-query";
import { Upload } from "@/hooks/sermonhooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Sermon() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titleForm, setTitleForm] = useState("");
  const [scriptureForm, setscriptureForm] = useState("");

 
  const [date, setDate] = React.useState<Date>();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const handleAudioUpdate = (files: File[]) => {
    setUploadedFiles(files);
    setUploadedFilesCount(files.length);
  };

 
  const { isLoading, mutate } = Upload("uploadsermon".toLowerCase());

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", titleForm);
    formData.append("scripture", scriptureForm);
    formData.append("audio", uploadedFiles[0]);
    formData.append("date", date?.toISOString() as string);

    mutate(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Sermon added successfully",
        });
        queryClient.invalidateQueries("Sermon Data");
        setIsDialogOpen(true);
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Sermon",
        });
        setIsDialogOpen(true);
      },

      onSettled: () => {
        // Executes after mutation is either successful or errors out
      },
    });
  };

  return (
    <div className="w-full pt-4">
      <h1 className="text-2xl font-semibold text-center pb-4">Sermons</h1>
      
      <Separator />
      <div className="flex columns-2 justify-evenly pt-5">
        <div className="flex items-center space-x-4">
          <Label htmlFor="title" className="font-medium">
            Title
          </Label>
          <Input
            className=""
            placeholder="Enter name"
            id="title"
            value={titleForm}
            onChange={(e) => setTitleForm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <Label className="font-medium">Scripture</Label>
          <Input
            placeholder="Enter scripture"
            id="scripture"
            value={scriptureForm}
            onChange={(e) => setscriptureForm(e.target.value)}
            className=""
          />
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
            <AuthAudio onAudioUpdate={handleAudioUpdate} />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:min-w-[225px]">
              {serverResponse && !isLoading ? (
                <>
                  <DialogHeader>
                    <DialogTitle>{serverResponse.messageTitle}</DialogTitle>
                    <DialogDescription>
                      {serverResponse.message}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose
                      asChild
                      onClick={() => setServerResponse(null)}
                    >
                      <Button>Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </>
              ) : null}
            </DialogContent>
          </Dialog>
          <form onSubmit={handleSubmit}>
            {isLoading ? (
              <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Adding Sermon...
              </Button>
            ) : (
              <Button type="submit" disabled={!canSubmit}>
                Add Sermon
              </Button>
            )}
          </form>
        </div>
      </div>

      <div className="flex flex-col">
        <SelectSermon />
        <EditSermon />
      </div>
    </div>
  );
}
export default Sermon;
