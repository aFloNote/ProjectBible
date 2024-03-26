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
import { Fetch } from "@/hooks/sermonhooks";
import { TopicType } from "@/types/sermon";
import {
  AlertDialog,
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
  const { data: topicsData } = Fetch<TopicType[]>("fetchtopics", "TopicData");
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
      deleteItem(
        { id: selectedTopic.topic_id, slug: selectedTopic.slug },
        {
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
              message: "Error Deleting Topic.",
            });
          },

          onSettled: () => {
            // Executes after mutation is either successful or errors out
            dispatch(setSelectedTopic(null));
          },
        }
      );
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (selectedTopic != null) {
      if (topicsData !== undefined) {
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
    if (uploadedFiles.length > 0) formData.append("image", uploadedFiles[0]);
    else formData.append("image", "default");
    if (selectedTopic) formData.append("topic_id", selectedTopic.topic_id);

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
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  useEffect(() => {
    setCanSubmit(headForm !== "" && selectedTopic != null);
  }, [headForm, uploadedFiles, selectedTopic]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-3 cursor-pointer"
          onClick={() => {
            setIsDialogOpen(true);
            dispatch(setSelectedTopic(null)); // Set selectedseries to null when dialog is opened
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
                <DialogTitle>Edit Topic</DialogTitle>
                <DialogDescription>
                  Edit Name, and Image, then click Edit Topic.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                <SelectTopic />
              </div>
              <div className="border-t-2 "></div>
              <div className="flex flex-col">
                <div className="flex flex-row pb-4 space-x-10 justify-center">
                  <div className="">
                    <div>
                      <Label htmlFor="head" className="font-medium pl-3 pb-1">
                        Name
                      </Label>
                      <Input
                        id="head"
                        placeholder="Enter Name"
                        value={headForm}
                        onChange={(e) => setHeadForm(e.target.value)}
                        className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t-2 pb-2 pt-2"></div>
                <div className="flex flex-col items-center justify-center">
                  <Label
                    htmlFor="typeimage"
                    className="text-center dark:text-white"
                  >
                    Insert Topic Image
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
                    <Button variant="destructive" disabled={!canSubmit}>
                      Delete Topic
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Topic?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>

                      <form
                        onSubmit={handleDelete}
                        className="bg-none border-none"
                      >
                        {isDeleting ? (
                          <Button>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Deleting Topic...
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            variant="destructive"
                            disabled={!canSubmit}
                          >
                            Confirm Delete
                          </Button>
                        )}
                      </form>
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
