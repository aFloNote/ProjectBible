"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthImage } from "@/views/admin/imagedrop";

import { useState } from "react";
import { Upload } from "@/hooks/sermonhooks";
import { useQueryClient } from "react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonType } from "@/types/sermon";
import {EditSermon} from "@/views/admin/sermonadmin/sermon/editsermon";
import React from "react";

export function Series() {
  const [titleForm, setTitleForm] = useState("");
  const [scriptureForm, setScriptureForm] = useState("");
  const [topicForm, setTopicForm] = useState("");
  const [date, setDate] = React.useState<Date>();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading, mutate } = Upload("uploadseries");

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
 
  const queryClient = useQueryClient();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const formData = new FormData();
    formData.append("title", titleForm);
    formData.append("scripture", scriptureForm);
    formData.append("audio", uploadedFiles[0]);
    formData.append("topic", topicForm);
    formData.append("date", date?.toISOString() as string);

    mutate(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Sermon added successfully",
        });
        setIsDialogOpen(true);
        queryClient.invalidateQueries("sermonData");
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

  // Determine if the form can be submitted based on name, ministry, and image presence
  const canSubmit =
    titleForm !== "" && scriptureForm !== "" && topicForm !== "" && date !== undefined;

  return ( 
    
  
    <>
      <h1 className="text-2xl font-bold mb-4 text-center pt-4">Sermons</h1>
      <div >
        <h2 className="text-xl font-bold mb-4 pl-16">Create a new Sermon or  <EditSermon/>  existing</h2>
        
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-8 items-center gap-4">
          <Label htmlFor="head" className="text-right col-span-1">
            Title
          </Label>      
          <Input
            id="head"
            placeholder="Enter Title: required"
            value={titleForm}
            onChange={(e) => setTitleForm(e.target.value)}
            className="col-span-3"
          />
          <Label htmlFor="desc" className="text-right col-span-1">
            Scripture
          </Label>
          <Input
            id="desc"
            placeholder="Enter Description: required"
            value={scriptureForm}
            onChange={(e) => setScriptureForm(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pl-28">
          <div className="flex flex-col items-center pr-56">
            <Label htmlFor="typeimage" className="dark:text-white">
              Topic
            </Label>
            <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
              <AuthImage onImageUpdate={handleImageUpdate} />
            </div>
          </div>
         
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex justify-center">
        {isLoading ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Creating Sermon...
          </Button>
        ) : (
       
          <Button type="submit" disabled={!canSubmit}>
            Create Sermon
          </Button>
        )}
      </form>
      {serverResponse && (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>{serverResponse.messageTitle}</DialogHeader>
          <DialogDescription>{serverResponse.message}</DialogDescription>
          <DialogFooter>
            <DialogClose asChild onClick={() => setServerResponse(null)}>
            <Button>
              Close
            </Button>
          </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
    

</>
);
}
