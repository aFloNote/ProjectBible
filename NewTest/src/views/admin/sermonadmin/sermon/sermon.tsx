import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { Label } from "@/components/ui/label";
import { AuthAudio } from "@/views/admin/audiodrop";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { EditSermon } from "@/views/admin/sermonadmin/sermon/editsermon";

import { SelectScripture } from "@/views/admin/sermonadmin/scriptures/selectscriptures";
import { SelectTopic } from "@/views/admin/sermonadmin/topic/selecttopic";
import { SelectSeries } from "@/views/admin/sermonadmin/series/selectseries";
import { SelectAuthor } from "@/views/admin/sermonadmin/author/selectAuthor";
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
import { useQueryClient } from "react-query";
import { Upload } from "@/hooks/sermonhooks";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function Sermon() {
  const { data: sermonData } = Fetch<SermonFullType[]>(
    "fetchsermons",
    "SermonData"
  );
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titleForm, setTitleForm] = useState("");
  const [scriptureForm, setScriptureForm] = useState("");
  const selectedAuthor = useSelector(
    (state: RootState) => state.sermonAdmin.selectedAuthor
  );
  const selectedSeries = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSeries
  );
  const selectedTopic = useSelector(
    (state: RootState) => state.sermonAdmin.selectedTopic
  );
  const selectedScripture = useSelector(
    (state: RootState) => state.sermonAdmin.selectedScripture
  );

  const [date, setDate] = React.useState<Date>();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [canSubmit, setCanSubmit] = useState(false);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const handleAudioUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };

  const { isLoading, mutate } = Upload("uploadsermon".toLowerCase());
  React.useEffect(() => {
    setCanSubmit(
      titleForm !== "" &&
        scriptureForm !== "" &&
        uploadedFiles.length > 0 &&
        date !== undefined &&
        selectedAuthor != null &&
        selectedSeries != null &&
        selectedTopic != null &&
        selectedScripture != null
    );
  }, [
    titleForm,
    scriptureForm,
    uploadedFiles,
    selectedAuthor,
    selectedSeries,
    selectedTopic,
    selectedScripture,
  ]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  
    event.preventDefault();
    if (sermonData !=undefined &&sermonData.length != 0) {
      const isHeadInItems = sermonData.some(
        (itemData) => itemData.SermonType.title.toLowerCase() === titleForm.toLowerCase()
      );
      if (isHeadInItems) {
        setServerResponse({
          success: false,
          messageTitle: "Error! Duplicate Sermons",
          message: "Sermon name already exists",
        });
        setIsDialogOpen(true);
        return;
      }
    }
    

    const formData = new FormData();
    formData.append("title", titleForm);
    formData.append("scripture", scriptureForm);
    formData.append("audio", uploadedFiles[0]);
    formData.append("date", date?.toISOString() as string);
    formData.append(
      "author_id",
      selectedAuthor ? selectedAuthor.author_id : ""
    );
    formData.append(
      "series_id",
      selectedSeries ? selectedSeries.series_id : ""
    );
    formData.append("topic_id", selectedTopic ? selectedTopic.topic_id : "");
    formData.append(
      "scripture_id",
      selectedScripture ? selectedScripture.scripture_id : ""
    );

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

      onSettled: () => {},
    });
  };

  return (
    <div className="w-full pt-4">
      <h1 className="text-2xl font-semibold text-center pb-4">Sermons</h1>

      <h2 className="text-xl font-bold mb-4 pl-16">
        Create a new Sermon or <EditSermon /> existing
      </h2>
      <div className="flex columns-2 justify-evenly pt-5">
        <div className="flex items-center space-x-4">
          <Label className="font-medium">Topic</Label>
          <SelectTopic buttonVar="ghost" />
        </div>

        <div className="flex items-center space-x-4">
          <Label className="font-medium">Book</Label>
          <SelectScripture buttonVar="ghost" />
        </div>
      </div>
      <div className="flex columns-2 justify-evenly">
        <div className="flex items-center space-x-4">
          <Label className="font-medium">Series</Label>
          <SelectSeries buttonVar="ghost" />
        </div>
        <div className="flex items-center space-x-4">
          <Label className="font-medium">Author</Label>
          <SelectAuthor buttonVar="ghost" />
        </div>
      </div>

      <div className="flex columns-2 justify-evenly pt-5 pb-5">
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
            placeholder="EX: John 3:16-17,Psalm 5:7-8 ect"
            id="scripture"
            value={scriptureForm}
            onChange={(e) => setScriptureForm(e.target.value)}
            className=""
          />
        </div>
      </div>

      <div className="flex columns-2 justify-evenly pt-5 pb-5">
        <div className="flex items-left space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={cn(
                  "justify-start text-left font-normal",
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
        </div>
        <div className="flex items-center space-x-4">
          <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
            <AuthAudio audiopath="" onAudioUpdate={handleAudioUpdate} />
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
        </div>
      </div>
      <div className="pt-5 flex justify-center">
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
  );
}
export default Sermon;
