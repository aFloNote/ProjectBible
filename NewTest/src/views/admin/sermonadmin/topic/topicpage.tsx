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
import { TopicType } from "@/types/sermon";
import { EditTopic } from "@/views/admin/sermonadmin/topic/edittopic";

export function Topic() {
  const [headForm, setHeadForm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading, mutate } = Upload("uploadtopic");

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const { data: topicData } = Fetch<TopicType[]>("fetchtopics", "TopicData");
  const queryClient = useQueryClient();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isHeadInItems = topicData?.some(
      (itemData) => itemData.name.toLowerCase() === headForm.toLowerCase()
    );
    console.log(isHeadInItems);
    if (isHeadInItems) {
      setServerResponse({
        success: false,
        messageTitle: "Error! Duplicate Topics",
        message: "Topic already exists",
      });
      setIsDialogOpen(true); 
      return;
    }

    const formData = new FormData();
    formData.append("name", headForm);
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
        queryClient.invalidateQueries("TopicData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Topic",
        });
        setIsDialogOpen(true);
      },

      onSettled: () => {
        // Executes after mutation is either successful or errors out
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  const canSubmit = headForm !== "" && uploadedFiles.length > 0;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center pt-4">Sermon Topic</h1>
      <div>
        <h2 className="text-xl font-bold mb-4 pl-16">
          Create a new Topic or <EditTopic /> existing
        </h2>
      </div>
      <div className="grid gap-4 py-4 pl-5">
        <div className="grid grid-cols-8 items-center gap-4">
          <Label htmlFor="head" className="text-right col-span-1">
            Name
          </Label>
          <Input
            id="head"
            placeholder="Enter Topic Name: required"
            value={headForm}
            onChange={(e) => setHeadForm(e.target.value)}
            className="col-span-2 text-left"
          />
          <Label htmlFor="typeimage" className="text-right dark:text-white col-span-2">
            Insert Topic Image
          </Label>
          <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500 col-span-2 w-40">
            <AuthImage onImageUpdate={handleImageUpdate} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex justify-center">
        {isLoading ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Creating Topic...
          </Button>
        ) : (
          <Button type="submit" disabled={!canSubmit}>
            Create Topic
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
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
