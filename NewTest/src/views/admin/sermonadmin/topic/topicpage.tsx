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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


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
          message: "Topic added successfully",
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
  const canSubmit = headForm !== "" ;

  return (
	<div className="flex flex-col items-center pt-10 bg-slate-50 dark:bg-background h-screen">
	<h1 className="text-2xl font-bold mb-4">Sermon Topic</h1>
	<div className="flex flex-row justify-center space-x-4">
	  <div className="flex flex-col">
		<Card>
		  <CardHeader>
			<CardTitle>
			  Create or <EditTopic /> existing.
			</CardTitle>
			<CardDescription></CardDescription>
		  </CardHeader>

		  <CardContent className="w-fill flex flex-col">
		  <div className="flex flex-row pb-4 space-x-10 justify-center">
		  <div className="flex flex-col">
			  <div className=''>
				<Label htmlFor="head" className="font-medium pl-3 pb-1">
				  Name
				</Label>
				<Input
				  id="head"
				  placeholder="Enter Name: required"
				  value={headForm}
				  onChange={(e) => setHeadForm(e.target.value)}
				  className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
				/>
				</div>
			  </div>
			  </div>
			  <div className="border-t-2 pb-2 pt-2"></div>
				<div className="flex flex-col items-center justify-center">
				  <Label htmlFor="typeimage" className="dark:text-white">
					Insert Topic Image
				  </Label>
				  <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
					<AuthImage onImageUpdate={handleImageUpdate} />
				  </div>
				</div>
			 
			

			<form onSubmit={handleSubmit} className="flex justify-center pt-4">
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
				  <DialogDescription>
					{serverResponse.message}
				  </DialogDescription>
				  <DialogFooter>
					<DialogClose
					  asChild
					  onClick={() => setServerResponse(null)}
					>
					  <Button>Close</Button>
					</DialogClose>
				  </DialogFooter>
				</DialogContent>
			  </Dialog>
			)}
		  </CardContent>
		</Card>
	  </div>
	</div>
  </div>
  );
}
