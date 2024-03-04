"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { useState } from "react";
import { useQueryClient } from "react-query";
import { Calendar as CalendarIcon } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSelectedSeries,setSelectedAuthor,setSelectedScripture,setSelectedTopic } from "@/redux/sermonAdminSelector";
import { SelectAuthor } from "@/views/admin/sermonadmin/author/selectAuthor";
import { SelectSeries } from "@/views/admin/sermonadmin/series/selectseries";
import { SelectScripture } from "@/views/admin/sermonadmin/scriptures/selectscriptures";
import { SelectTopic } from "@/views/admin/sermonadmin/topic/selecttopic";
import { SelectSermon } from "@/views/admin/sermonadmin/sermon/selectSermon";
import { AuthAudio } from "@/views/admin/audiodrop";
import { Fetch, Upload, Delete} from "@/hooks/sermonhooks";

import {SermonType} from "@/types/sermon";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { setSelectedSermon } from "@/redux/sermonAdminSelector";
import React from "react";
import { format } from "date-fns";

export function EditSermon() {
  const dispatch=useDispatch()
  const selectedSermon = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSermon
  );
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titleForm, setTitleForm] = useState(
    selectedSermon ? selectedSermon.title : ""
  );

  const [scriptureForm, setScriptureForm] = useState("")
  const [scriptreIDForm, setScriptureIDForm] = useState(
    selectedSermon ? selectedSermon.scripture_id : ""
  )
  const [topicForm, setTopicForm] = useState(
    selectedSermon ? selectedSermon.topic_id : ""
  );
  const [seriesForm, setSeriesForm] = useState(
    selectedSermon ? selectedSermon.series_id : ""
  );
  const [authorForm, setAuthorForm] = useState(
    selectedSermon ? selectedSermon.author_id : ""
  );
  const [audioForm, setAudioForm] = useState(
    selectedSermon ? selectedSermon.audio_path : ""
  );
  const [canSubmit, setCanSubmit] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading: isUploading, mutate: upload } = Upload("updatesermon");
  const { isLoading: isDeleting, mutate: deleteItem } = Delete("deletesermon");
  const [date, setDate] = useState<Date>();
  const { data: sermonData } = Fetch<SermonType[]>(
    "fetchsermons",
    "SermonData"
  );

  useEffect(() => {
    console.log(selectedSermon)
    setTitleForm(selectedSermon ? selectedSermon.title : "");
    setScriptureForm(selectedSermon ? selectedSermon.scripture : "");
    setTopicForm(selectedSermon ? selectedSermon.topic_id : "");
    setSeriesForm(selectedSermon ? selectedSermon.series_id : "");
    setAuthorForm(selectedSermon ? selectedSermon.author_id : "");
    setDate(selectedSermon ? new Date(selectedSermon.date_delivered) : undefined);

  }, [selectedSermon]);
  const handleAudioUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const queryClient = useQueryClient();
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedSermon) {
      deleteItem(selectedSermon.series_id, {
        onSuccess: () => {
          // Handle successful mutation
          setServerResponse({
            success: true,
            messageTitle: "Success!",
            message: "Series Deleted successfully",
          });
          queryClient.invalidateQueries("SermonData");
        },
        onError: () => {
          setServerResponse({
            success: false,
            messageTitle: "Error!",
            message:
              "Error Deleting Series, ensure all sermons and series are deleted for this Series",
          });
        },

        onSettled: () => {
          // Executes after mutation is either successful or errors out
        },
      });
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { if (selectedSermon != null) {
    event.preventDefault();
    if (sermonData !== undefined&&sermonData.length>1){
    const filteredTopicsData = sermonData?.filter(
      (itemData) => itemData.sermon_id !== selectedSermon.sermon_id
    );

    const isHeadInItems = filteredTopicsData?.some(
      (itemData) => itemData.title.toLowerCase() === titleForm.toLowerCase()
    );

    if (isHeadInItems) {
      setServerResponse({
        success: false,
        messageTitle: "Error! Duplicate Topics",
        message: "Topic already exists",
      });
      setIsDialogOpen(true);
      return;
    }
  }
}
    event.preventDefault();
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
    formData.append("sermon_id", selectedSermon ? selectedSermon.sermon_id : "")

    upload(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Series added successfully",
        });

        queryClient.invalidateQueries("SeriesData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Series",
        });
      },

      onSettled: () => {
        setSelectedSermon(null);
        // Executes after mutation is either successful or errors out
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
 
  React.useEffect(() => {
   
    setCanSubmit(
      
      titleForm !== "" &&
        scriptureForm !== "" &&
        uploadedFiles.length > 0 &&
        date!== undefined &&
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
    date
  ]);

  return (
    <Dialog onOpenChange={open => {
      if (!open) {
        console.log("closed")
        dispatch(setSelectedSeries(null));
        dispatch(setSelectedSermon(null));
        dispatch(setSelectedAuthor(null));
        dispatch(setSelectedScripture(null))
        dispatch(setSelectedTopic(null))
      }
    
    }}>
      <DialogTrigger asChild>
        <Button className="h-5" onClick={() => {setIsDialogOpen(true)
         dispatch(setSelectedSeries(null));
         dispatch(setSelectedSermon(null));
         dispatch(setSelectedAuthor(null));
         dispatch(setSelectedScripture(null))
         dispatch(setSelectedTopic(null))}}>
          Edit/Del
        </Button>
      </DialogTrigger>
      {isDialogOpen && (
        <DialogContent className="sm:min-w-[500px]">
          {serverResponse ? (
            <>
              <DialogHeader>
                <DialogTitle>{serverResponse.messageTitle}</DialogTitle>
                <DialogDescription>{serverResponse.message}</DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose
                  asChild
                  onClick={() => {
                    setServerResponse(null);
                    setIsDialogOpen(false);
                  }}
                >
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Edit Sermon</DialogTitle>
                <DialogDescription>
                  Edit Title, Scripture, and image, then click Edit Series.
                </DialogDescription>
              </DialogHeader>
              <SelectSermon />
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
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="head" className="text-left">
                    Title
                  </Label>
                  <Input
                    id="head"
                    placeholder="Enter Title"
                    value={titleForm}
                    onChange={(e) => setTitleForm(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-left">
                    Scripture
                  </Label>
                  <Input
                    id="desc"
                    placeholder="Enter Scripture"
                    value={scriptureForm}
                    onChange={(e) => setScriptureForm(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="flex justify-center">
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
        </div>
                
                <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
            <AuthAudio onAudioUpdate={handleAudioUpdate}
             audiopath={selectedSermon ? selectedSermon.audio_path : ""} />
          </div>
          
                
              </div>
              <DialogFooter>
                <form onSubmit={handleSubmit}>
                  {isUploading ? (
                    <Button >
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Editing Series...
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!canSubmit}>Edit Series</Button>
                  )}
                </form>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!canSubmit}>Delete Series</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Series? This action
                      cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <form onSubmit={handleDelete}>
                          {isDeleting ? (
                            <Button >
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Deleting Series...
                            </Button>
                          ) : (
                            <Button type="submit" disabled={!canSubmit}>Confirm Delete</Button>
                          )}
                        </form>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
