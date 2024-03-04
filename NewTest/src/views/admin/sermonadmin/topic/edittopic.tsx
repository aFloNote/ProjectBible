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
import { AuthImage } from "@/views/admin/imagedrop";

import { useSelector } from "react-redux";
import { setSelectedTopic } from "@/redux/sermonAdminSelector";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { useState } from "react";
import { Upload, Delete } from "@/hooks/sermonhooks";
import { useQueryClient } from "react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import {Fetch} from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";
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

import { SelectTopic } from "@/views/admin/sermonadmin/topic/selecttopic";


export function EditTopic() {
  const selectedTopic = useSelector(
    (state: RootState) => state.sermonAdmin.selectedTopic
  );
  console.log(selectedTopic);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [headForm, setHeadForm] = useState(
    selectedTopic ? selectedTopic.name : ""
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading: isUploading, mutate: upload } = Upload("updatetopic");
  const { isLoading: isDeleting, mutate: deleteItem } = Delete("deletetopic");
  const dispatch = useDispatch();
  const { data: topicsData } = Fetch<TopicType[]>(
    "fetchtopics",
    "TopicData"
  );
  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  useEffect(() => {
    setHeadForm(selectedTopic ? selectedTopic.name : "");
    
  }, [selectedTopic]);

  const queryClient = useQueryClient();
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedTopic) {
      deleteItem(selectedTopic.topic_id, {
        onSuccess: () => {
          // Handle successful mutation
          setServerResponse({
            success: true,
            messageTitle: "Success!",
            message: "Topic Deleted successfully",
          });
          queryClient.invalidateQueries("TopicData");
        },
        onError: () => {
          setServerResponse({
            success: false,
            messageTitle: "Error!",
            message:
              "Error Deleting Topic.",
          });
        },

        onSettled: () => {
          // Executes after mutation is either successful or errors out
          dispatch(setSelectedTopic(null));
        },
      });
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (selectedTopic != null) {
      if (topicsData !== undefined&&topicsData.length>1){
      const filteredTopicsData = topicsData?.filter(
        (itemData) => itemData.topic_id !== selectedTopic.topic_id
      );
  
      const isHeadInItems = filteredTopicsData?.some(
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
    }
  }
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", headForm);

    formData.append("image", uploadedFiles[0]);
    if (selectedTopic) formData.append("topic_id", selectedTopic.topic_id);
    console.log(uploadedFiles);
    upload(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Topic added successfully",
        });
       
        queryClient.invalidateQueries("TopicData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Topic",
        });
      },

      onSettled: () => {
        dispatch(setSelectedTopic(null));
        // Executes after mutation is either successful or errors out
        console.log("Mutation is settled");
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  useEffect(() => {

    setCanSubmit(
      headForm !== "" &&

        uploadedFiles.length > 0 &&
        selectedTopic != null
    );
  }, [headForm, uploadedFiles, selectedTopic]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-5"
          onClick={() => {
            setIsDialogOpen(true);
            dispatch(setSelectedTopic(null)); // Set selectedtopic to null when dialog is opened
          }}
        >
          Edit/Delete
        </Button>
      </DialogTrigger>
      {isDialogOpen && (
        <DialogContent className="sm:min-w-[225px]">
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
                    dispatch(setSelectedTopic(null));
                  }}
                >
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Edit topic</DialogTitle>
                <DialogDescription>
                  Edit Name and image, then click Edit Topic.
                </DialogDescription>
              </DialogHeader>
              <SelectTopic />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="head" className="text-left">
                    Name
                  </Label>
                  <Input
                    id="head"
                    placeholder="Enter Title"
                    value={headForm}
                    onChange={(e) => setHeadForm(e.target.value)}
                    className="col-span-3"
                  />
                </div>
             
                <div className="grid grid-rows-1 flex justify-center gap-4">
                  <Label
                    htmlFor="typeimage"
                    className="text-center dark:text-white"
                  >
                    Insert topic Image
                  </Label>
                  <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                    <AuthImage
                      onImageUpdate={handleImageUpdate}
                      imgpath={selectedTopic ? selectedTopic.image_path : ""}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <form onSubmit={handleSubmit}>
                  {isUploading ? (
                    <Button>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Editing Topic...
                    </Button>
                  ) : (
                    <Button disabled={!canSubmit} type="submit">
                      Edit Topic
                    </Button>
                  )}
                </form>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!canSubmit}>Delete Topic</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Topic? This action
                      cannot be undone. Sermons in this
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <form onSubmit={handleDelete}>
                          {isDeleting ? (
                            <Button disabled={!canSubmit}>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Deleting topic...
                            </Button>
                          ) : (
                            <Button type="submit" variant='destructive'>Confirm Delete</Button>
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
