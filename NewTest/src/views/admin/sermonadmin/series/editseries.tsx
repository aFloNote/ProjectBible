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
import { setSelectedSeries } from "@/redux/sermonAdminSelector";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { useState } from "react";
import { Upload, Delete } from "@/hooks/sermonhooks";
import { useQueryClient } from "react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
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

import { SelectSeries } from "@/views/admin/sermonadmin/series/selectseries";


export function EditSeries() {
  const selectedSeries = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSeries
  );
  const [canSubmit, setCanSubmit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [headForm, setHeadForm] = useState(
    selectedSeries ? selectedSeries.title : ""
  );
  const [descForm, setDescForm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading: isUploading, mutate: upload } = Upload("updateseries");
  const { isLoading: isDeleting, mutate: deleteItem } = Delete("deleteseries");
  const dispatch = useDispatch();
  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  useEffect(() => {
    setHeadForm(selectedSeries ? selectedSeries.title : "");
    setDescForm(selectedSeries ? selectedSeries.description : "");
  }, [selectedSeries]);
  dispatch(setSelectedSeries(null));
  const queryClient = useQueryClient();
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedSeries) {
      deleteItem(selectedSeries.series_id, {
        onSuccess: () => {
          // Handle successful mutation
          setServerResponse({
            success: true,
            messageTitle: "Success!",
            message: "Series Deleted successfully",
          });
          queryClient.invalidateQueries("seriesData");
        },
        onError: () => {
          setServerResponse({
            success: false,
            messageTitle: "Error!",
            message:
              "Error Deleting series, ensure all sermons and series are deleted for this Series",
          });
        },

        onSettled: () => {
          // Executes after mutation is either successful or errors out
          dispatch(setSelectedSeries(null));
        },
      });
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    formData.append("image", uploadedFiles[0]);
    if (selectedSeries) formData.append("series_id", selectedSeries.series_id);
    console.log(uploadedFiles);
    upload(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Series added successfully",
        });
        console.log("series editteed");
        queryClient.invalidateQueries("seriesData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Series",
        });
      },

      onSettled: () => {
        dispatch(setSelectedSeries(null));
        // Executes after mutation is either successful or errors out
        console.log("Mutation is settled");
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  useEffect(() => {
    console.log(headForm !== "" && descForm !== "" && uploadedFiles.length > 0);
    setCanSubmit(
      headForm !== "" &&
        descForm !== "" &&
        uploadedFiles.length > 0 &&
        selectedSeries != null
    );
  }, [headForm, descForm, uploadedFiles, selectedSeries]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-5"
          onClick={() => {
            setIsDialogOpen(true);
            dispatch(setSelectedSeries(null)); // Set selectedseries to null when dialog is opened
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
                    dispatch(setSelectedSeries(null));
                  }}
                >
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Edit series</DialogTitle>
                <DialogDescription>
                  Edit Name, Minsitry, and image, then click Edit series.
                </DialogDescription>
              </DialogHeader>
              <SelectSeries />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="head" className="text-left">
                    Title
                  </Label>
                  <Input
                    id="head"
                    placeholder="Enter Title"
                    value={headForm}
                    onChange={(e) => setHeadForm(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-left">
                    Description
                  </Label>
                  <Input
                    id="desc"
                    placeholder="Enter Description"
                    value={descForm}
                    onChange={(e) => setDescForm(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-rows-1 flex justify-center gap-4">
                  <Label
                    htmlFor="typeimage"
                    className="text-center dark:text-white"
                  >
                    Insert Series Image
                  </Label>
                  <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                    <AuthImage
                      onImageUpdate={handleImageUpdate}
                      imgpath={selectedSeries ? selectedSeries.image_path : ""}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <form onSubmit={handleSubmit}>
                  {isUploading ? (
                    <Button>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Editing Series...
                    </Button>
                  ) : (
                    <Button disabled={!canSubmit} type="submit">
                      Edit Series
                    </Button>
                  )}
                </form>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Series</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Series? This action
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
                              Deleting series...
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
