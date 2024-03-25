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
import {
  setSelectedSeries,
  setSelectedAuthor,
  setSelectedScripture,
  setSelectedTopic,
} from "@/redux/sermonAdminSelector";
import { SelectAuthor } from "@/views/admin/sermonadmin/author/selectAuthor";
import { SelectSeries } from "@/views/admin/sermonadmin/series/selectseries";
import { SelectScripture } from "@/views/admin/sermonadmin/scriptures/selectscriptures";
import { SelectTopic } from "@/views/admin/sermonadmin/topic/selecttopic";
import { SelectSermon } from "@/views/admin/sermonadmin/sermon/selectSermon";
import { AuthAudio } from "@/views/admin/audiodrop";
import { Fetch, Upload, Delete } from "@/hooks/sermonhooks";

import { SermonFullType } from "@/types/sermon";
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
  const dispatch = useDispatch();
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

  const [scriptureForm, setScriptureForm] = useState("");
  // @ts-ignore
  const [topicForm, setTopicForm] = useState(
    selectedSermon ? selectedSermon.topic_id : ""
  );
  // @ts-ignore
  const [seriesForm, setSeriesForm] = useState(
    selectedSermon ? selectedSermon.series_id : ""
  );
  // @ts-ignore
  const [authorForm, setAuthorForm] = useState(
    selectedSermon ? selectedSermon.author_id : ""
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
  const { data: sermonData } = Fetch<SermonFullType[]>(
    "fetchsermons",
    "SermonData"
  );

  useEffect(() => {
    setTitleForm(selectedSermon ? selectedSermon.title : "");
    setScriptureForm(selectedSermon ? selectedSermon.scripture : "");
    setTopicForm(selectedSermon ? selectedSermon.topic_id : "");
    setSeriesForm(selectedSermon ? selectedSermon.series_id : "");
    setAuthorForm(selectedSermon ? selectedSermon.author_id : "");
    setDate(
      selectedSermon ? new Date(selectedSermon.date_delivered) : undefined
    );
  }, [selectedSermon]);
  const handleAudioUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const queryClient = useQueryClient();
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedSermon) {
      deleteItem(
        { id: selectedSermon.sermon_id, slug: selectedSermon.slug },
        {
          onSuccess: () => {
            // Handle successful mutation
            setServerResponse({
              success: true,
              messageTitle: "Success!",
              message: "Sermon Deleted successfully",
            });
            queryClient.invalidateQueries("SermonData");
          },
          onError: () => {
            setServerResponse({
              success: false,
              messageTitle: "Error!",
              message: "Error Deleting Sermon, Contact admin if error persists",
            });
          },

          onSettled: () => {
            // Executes after mutation is either successful or errors out
          },
        }
      );
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (selectedSermon != null) {
      event.preventDefault();
      if (sermonData !== undefined && sermonData.length > 1) {
        const filteredTopicsData = sermonData?.filter(
          (itemData) =>
            itemData.SermonType.sermon_id !== selectedSermon.sermon_id
        );

        const isHeadInItems = filteredTopicsData?.some(
          (itemData) =>
            itemData.SermonType.title.toLowerCase() === titleForm.toLowerCase()
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
    formData.append(
      "sermon_id",
      selectedSermon ? selectedSermon.sermon_id : ""
    );

    upload(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Sermon updated successfully",
        });

        queryClient.invalidateQueries("SermonData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error updating Sermon",
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
    date,
  ]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          dispatch(setSelectedSeries(null));
          dispatch(setSelectedSermon(null));
          dispatch(setSelectedAuthor(null));
          dispatch(setSelectedScripture(null));
          dispatch(setSelectedTopic(null));
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="h-2 cursor-pointer"
          onClick={() => {
            setIsDialogOpen(true);
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedScripture(null));
            dispatch(setSelectedTopic(null));
          }}
        >
          Edit/Del
        </Button>
      </DialogTrigger>
      {isDialogOpen && (
        <DialogContent className="sm:min-w-[580px]">
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
                  Make Edits, then click Edit Sermon.
                </DialogDescription>
              </DialogHeader>
			  <div className='flex flex-row justify-center'>
              <SelectSermon />
			  </div>
			  <div className="border-t-2 pb-2"></div>
              <div className="flex flex-col">
                <div className="flex flex-row pb-4 space-x-10">
                  <div className="flex flex-col">
                    <Label className="font-medium pl-3 pb-1">Title</Label>
					<Input
                      id="head"
                      placeholder="Enter Title"
                      value={titleForm}
                      onChange={(e) => setTitleForm(e.target.value)}
                      className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-medium pl-3 pb-1">Author</Label>
                    <SelectAuthor />
                  </div>
                </div>
                <div className="flex flex-row pb-4 space-x-10">
                  <div className="flex flex-col">
                    <Label className="font-medium pl-3 pb-1">Topic</Label>
                    <SelectTopic />
                  </div>

                  <div className="flex flex-col">
                    <Label className="font-medium pl-3 pb-1">Series</Label>
                    <SelectSeries />
                  </div>
                </div>

				<div className="flex flex-row pb-4 space-x-10">
				<div className="flex flex-col">
                    <Label className="font-medium pl-3 pb-1">Book</Label>
                    <SelectScripture />
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-medium pl-3 pb-1">Scripture</Label>
					<Input
                      id="desc"
                      placeholder="Enter Scripture"
                      value={scriptureForm}
                      onChange={(e) => setScriptureForm(e.target.value)}
                      className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                    />
                  </div>

                 
                </div>
				<div className="border-t-2 pb-2"></div>
                 
                  <div className="flex justify-center pb-2">
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
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
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
                    <AuthAudio
                      onAudioUpdate={handleAudioUpdate}
                      audiopath={
                        selectedSermon ? selectedSermon.audio_path : ""
                      }
                    />
                  </div>
              
              </div>
              <DialogFooter>
                <form onSubmit={handleSubmit}>
                  {isUploading ? (
                    <Button>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Editing Sermon...
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!canSubmit}>
                      Edit Sermon
                    </Button>
                  )}
                </form>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!canSubmit}>
                      Delete Sermon
                    </Button>
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
                            <Button>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Deleting Sermon...
                            </Button>
                          ) : (
                            <Button type="submit" disabled={!canSubmit}>
                              Confirm Delete
                            </Button>
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
