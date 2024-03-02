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
import { SeriesType } from "@/types/sermon";
import {EditSeries} from "@/views/admin/sermonadmin/series/editseries";

export function Series() {
  const [headForm, setHeadForm] = useState("");
  const [descForm, setDescForm] = useState("");;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading, mutate } = Upload("uploadseries");

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const { data: seriesData } = Fetch<SeriesType[]>(
    "fetchseries",
    "SeriesData"
  );
  const queryClient = useQueryClient();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isHeadInItems = seriesData?.some(
      (itemData) => itemData.title === headForm
    );
    if (isHeadInItems) {
      setServerResponse({
        success: false,
        messageTitle: "Error! Duplicate series",
        message: "series already exists",
      });
      return;
    }

    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    formData.append("image", uploadedFiles[0]);

    mutate(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Series added successfully",
        });
        setIsDialogOpen(true);
        queryClient.invalidateQueries("seriesData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Auhtor",
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
    headForm !== "" && descForm !== "" && uploadedFiles.length > 0;

  return ( 
    
  
    <>
      <h1 className="text-2xl font-bold mb-4 text-center pt-4">Sermon Series</h1>
      <div >
        <h2 className="text-xl font-bold mb-4 pl-16">Create a new Series or  <EditSeries/>  existing</h2>
        
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-8 items-center gap-4">
          <Label htmlFor="head" className="text-right col-span-1">
            Title
          </Label>      
          <Input
            id="head"
            placeholder="Enter Title: required"
            value={headForm}
            onChange={(e) => setHeadForm(e.target.value)}
            className="col-span-3"
          />
          <Label htmlFor="desc" className="text-right col-span-1">
            Description
          </Label>
          <Input
            id="desc"
            placeholder="Enter Description: required"
            value={descForm}
            onChange={(e) => setDescForm(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pl-28">
          <div className="flex flex-col items-center pr-56">
            <Label htmlFor="typeimage" className="dark:text-white">
              Insert series Image
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
            Creating series...
          </Button>
        ) : (
       
          <Button type="submit" disabled={!canSubmit}>
            Create series
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
