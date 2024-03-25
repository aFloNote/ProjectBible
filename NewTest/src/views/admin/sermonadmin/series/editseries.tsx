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
import { Fetch } from "@/hooks/sermonhooks";
import { SeriesType } from "@/types/sermon";
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

import { SelectSeries } from "@/views/admin/sermonadmin/series/selectseries";

export function EditSeries() {
  const { data: seriesData } = Fetch<SeriesType[]>("fetchseries", "SeriesData");
  const selectedSeries = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSeries
  );
  useEffect(() => {
    setHeadForm(selectedSeries ? selectedSeries.title : "");
    setDescForm(selectedSeries ? selectedSeries.description : "");
  }, [selectedSeries]);
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

  const queryClient = useQueryClient();
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedSeries) {
      deleteItem(
        { id: selectedSeries.series_id, slug: selectedSeries.slug },
        {
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
        }
      );
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (
      selectedSeries != null &&
      seriesData != undefined &&
      seriesData.length > 0
    ) {
      const filteredSeriesData = seriesData?.filter(
        (itemData) => itemData.series_id !== selectedSeries.series_id
      );

      const isHeadInItems = filteredSeriesData?.some(
        (itemData) => itemData.title.toLowerCase() === headForm.toLowerCase()
      );

      if (isHeadInItems) {
        setServerResponse({
          success: false,
          messageTitle: "Error! Duplicate Series Title",
          message: "Series Title already exists",
        });
        setIsDialogOpen(true);
        return;
      }
    }
    event.preventDefault();
    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    formData.append("image", uploadedFiles[0]);
    if (selectedSeries) formData.append("series_id", selectedSeries.series_id);

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
        dispatch(setSelectedSeries(null));
        // Executes after mutation is either successful or errors out
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  useEffect(() => {
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
          className="h-3 cursor-pointer"
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
                <DialogTitle>Edit Series</DialogTitle>
                <DialogDescription>
                  Edit Title, Description, and Image, then click Edit series.
                </DialogDescription>
              </DialogHeader>
			  <div className='flex justify-center'>
              <SelectSeries />
			  </div>
			  <div className="border-t-2 "></div>
              <div className="flex flex-col">
                <div className="flex flex-row pb-4 space-x-10 justify-center">
                  <div className="">
					<div>
                    <Label htmlFor="head" className="font-medium pl-3 pb-1">
                      Title
                    </Label>
                    <Input
                      id="head"
                      placeholder="Enter Title"
                      value={headForm}
                      onChange={(e) => setHeadForm(e.target.value)}
                      className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                    />

                  </div>
                  <div className="pt-2">
                    <Label htmlFor="desc" className="font-medium pl-3 pb-1">
                      Description
                    </Label>
                    <Input
                      id="desc"
                      placeholder="Enter Description"
                      value={descForm}
                      onChange={(e) => setDescForm(e.target.value)}
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
                      Insert Series Image
                    </Label>
                    <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                      <AuthImage
                        onImageUpdate={handleImageUpdate}
                        imgpath={
                          selectedSeries ? selectedSeries.image_path : ""
                        }
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
                    <Button variant="destructive" disabled={!canSubmit}>
                      Delete Series
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Series?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>
                   
                        <form onSubmit={handleDelete} className='bg-none border-none'>
                          {isDeleting ? (
                            <Button>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Deleting series...
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
