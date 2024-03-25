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
import { setSelectedAuthor } from "@/redux/sermonAdminSelector";
import { useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { useState } from "react";
import { Upload, Delete } from "@/hooks/sermonhooks";
import { useQueryClient } from "react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import {Fetch} from "@/hooks/sermonhooks";
import { AuthorType } from "@/types/sermon";
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

import { SelectAuthor } from "@/views/admin/sermonadmin/author/selectAuthor";

export function EditAuthor() {
  const selectedAuthor = useSelector(
    (state: RootState) => state.sermonAdmin.selectedAuthor
  );
  const [canSubmit, setCanSubmit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [headForm, setHeadForm] = useState(
    selectedAuthor ? selectedAuthor.name : ""
  );
  const [descForm, setDescForm] = useState("");
  const [bioForm, setBioForm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading: isUploading, mutate: upload } = Upload("updateauthor");
  const { isLoading: isDeleting, mutate: deleteItem } = Delete("deleteauthor");
  const { data: authorsData } = Fetch<AuthorType[]>(
    "fetchauthors",
    "AuthorData"
  );
  const dispatch = useDispatch();
  

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  useEffect(() => {
    setHeadForm(selectedAuthor ? selectedAuthor.name : "");
    setDescForm(selectedAuthor ? selectedAuthor.ministry : "");
    setBioForm(selectedAuthor ? selectedAuthor.bio_link : "");
  }, [selectedAuthor]);

  const queryClient = useQueryClient();
  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedAuthor) {
      deleteItem({id:selectedAuthor.author_id,slug:selectedAuthor.slug}, {
        onSuccess: () => {
          // Handle successful mutation
          setServerResponse({
            success: true,
            messageTitle: "Success!",
            message: "Author Deleted successfully",
          });
          queryClient.invalidateQueries("AuthorData");
        },
        onError: () => {
          setServerResponse({
            success: false,
            messageTitle: "Error!",
            message:
              "Error Deleting Author, ensure all sermons and series are deleted for this author",
          });
        },

        onSettled: () => {
          // Executes after mutation is either successful or errors out
          
        },
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (selectedAuthor != null && authorsData!=undefined && authorsData.length>0) {
      const filteredAuthorsData = authorsData?.filter(
        (itemData) => itemData.author_id !== selectedAuthor.author_id
      );
  
      const isHeadInItems = filteredAuthorsData?.some(
        (itemData) => itemData.name.toLowerCase() === headForm.toLowerCase()
      );
  
      if (isHeadInItems) {
        setServerResponse({
          success: false,
          messageTitle: "Error! Duplicate Authors Name",
          message: "Author name already exists",
        });
        setIsDialogOpen(true);
        return;
      }
    }
    event.preventDefault();
    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    formData.append("biolink", bioForm);
    formData.append("image", uploadedFiles[0]);
    if (selectedAuthor) formData.append("author_id", selectedAuthor.author_id);
   
    upload(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Author added successfully",
        });
     
        queryClient.invalidateQueries("AuthorData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding author",
        });
      },

      onSettled: () => {
        dispatch(setSelectedAuthor(null));
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
        selectedAuthor != null
    );
  }, [headForm, descForm, uploadedFiles, selectedAuthor]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-3 cursor-pointer"
          onClick={() => {
            setIsDialogOpen(true);
            dispatch(setSelectedAuthor(null)); // Set selectedseries to null when dialog is opened
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
                    dispatch(setSelectedAuthor(null));
                  }}
                >
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Edit Author</DialogTitle>
                <DialogDescription>
                  Edit Name, Minsitry, and Image, then click Edit Author.
                </DialogDescription>
              </DialogHeader>
			  <div className='flex justify-center'>
              <SelectAuthor />
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
                  <div className="pt-2">
                    <Label htmlFor="desc" className="font-medium pl-3 pb-1">
                      Minisry
                    </Label>
                    <Input
                      id="desc"
                      placeholder="Enter Ministry"
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
                      Insert Author Image
                    </Label>
                    <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                      <AuthImage
                        onImageUpdate={handleImageUpdate}
                        imgpath={
                          selectedAuthor ? selectedAuthor.image_path : ""
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
                      Editing Author...
                    </Button>
                  ) : (
                    <Button disabled={!canSubmit} type="submit">
                      Edit Author
                    </Button>
                  )}
                </form>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={!canSubmit}>
                      Delete Author
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Author?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>
                   
                        <form onSubmit={handleDelete} className='bg-none border-none'>
                          {isDeleting ? (
                            <Button>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Deleting Author...
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
