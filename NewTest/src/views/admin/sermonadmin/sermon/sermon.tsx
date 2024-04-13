import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { Label } from "@/components/ui/label";
import { AuthAudio } from "@/views/admin/audiodrop";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { setSelectedSermonPage } from "@/redux/sermonAdminSelector";

export function Sermon() {
  const { data: sermonData } = Fetch<SermonFullType[]>(
    "fetchsermons",
    "SermonData"
  );
  const dispatch=useDispatch();
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
    (state: RootState) => state.sermonAdmin.selectedTopics
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
  useEffect(() => {
    const currentPath = location.pathname;
    let pageName = currentPath.substring(1); // remove the leading slash

    // If the path is nested, you might want to get only the first part
    if (pageName.includes("/")) {
      pageName = pageName.split("/")[0];
    }
	

    dispatch(setSelectedSermonPage("sermons"));
  }, [location, dispatch]);
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
    if (sermonData != undefined && sermonData.length != 0) {
      const isHeadInItems = sermonData.some(
        (itemData) =>
          itemData.SermonType.title.toLowerCase() === titleForm.toLowerCase()
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
	if (selectedTopic != null)
   		formData.append("topic_id", selectedTopic.map(topic => topic.topic_id).join(","));
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
    <div className="flex flex-col items-center pt-10 bg-slate-50 dark:bg-background h-screen">
      <h1 className="text-2xl font-bold mb-4">Sermons</h1>
	  <div className='flex flex-row justify-center space-x-4'>
	  <div className='flex flex-col'>
      <Card>
        <CardHeader>
          <CardTitle>Create or <EditSermon/> existing.</CardTitle>
          <CardDescription>
            Fill in all information then click "Add Sermon".
          </CardDescription>
        </CardHeader>

        <CardContent className="w-fill flex flex-col">
          <div className="flex flex-row pb-4 space-x-10">
            <div className="flex flex-col">
              <Label htmlFor="title" className="font-medium pl-3 pb-1">
                Title
              </Label>
              <Input
                className=" w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                placeholder="Enter name"
                id="title"
                value={titleForm}
                onChange={(e) => setTitleForm(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <Label className="font-medium pl-4 pb-1">Author</Label>
              <SelectAuthor />
            </div>
          </div>

		  <div className="flex flex-row pb-4 space-x-10">
            <div className="flex flex-col">
              <Label htmlFor="title" className="font-medium pl-3 pb-1">
                Topic
              </Label>
             <SelectTopic />
            </div>

            <div className="flex flex-col">
              <Label className="font-medium pl-4 pb-1">Series</Label>
              <SelectSeries />
            </div>
          </div>

		  <div className="flex flex-row pb-4 space-x-10">
            <div className="flex flex-col">
              <Label htmlFor="title" className="font-medium pl-3 pb-1">
                Book
              </Label>
             <SelectScripture />
            </div>

            <div className="flex flex-col">
			<Label className="font-medium pl-3 pb-1">Scripture</Label>
              <Input
                placeholder="John 3:16-17, Psalm 5:7-8"
                id="scripture"
                value={scriptureForm}
                onChange={(e) => setScriptureForm(e.target.value)}
                className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
              />
            </div>
          </div>

          <div className="border-t-2 pb-2"></div>


          <div className="flex justify-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  className={cn(
                    "font-normal"
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
          <div className="flex flex-col pt-2">
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
        </CardContent>
      </Card>
	  </div>

	  </div>
    </div>
  );
}
export default Sermon;


