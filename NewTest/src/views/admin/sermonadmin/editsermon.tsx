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
import { setSelectedSermon } from "@/redux/sermonAdminSelector";

export function EditSermon() {
  const selectedSermon = useSelector(
    (state: RootState) => state.sermonAdmin.selectedSeries
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [headForm, setHeadForm] = useState(
    selectedSermon ? selectedSermon.title : ""
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

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  useEffect(() => {
    setHeadForm(selectedSermon ? selectedSermon.title : "");
    setDescForm(selectedSermon ? selectedSermon.description : "");
  }, [selectedSermon]);

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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    if (selectedSermon) formData.append("sermon_id", selectedSermon.series_id);
  
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
  const canSubmit =
    headForm !== "" && descForm !== "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!selectedSermon}
          onClick={() => setIsDialogOpen(true)}
        >
          Edit/Del Series
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
                  Edit Title, Description, and image, then click Edit Series.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="head" className="text-left">
                    Title
                  </Label>
                  <Input
                    id="head"
                    placeholder="Enter name"
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
                    placeholder="Enter ministry"
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
               
                </div>
              </div>
              <DialogFooter>
                <form onSubmit={handleSubmit}>
                  {isUploading ? (
                    <Button disabled={!canSubmit}>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Editing Series...
                    </Button>
                  ) : (
                    <Button type="submit">Edit Series</Button>
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
                      cannot be undone.
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
                              Deleting Series...
                            </Button>
                          ) : (
                            <Button type="submit">Confirm Delete</Button>
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
