"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthImage } from "@/views/admin/imagedrop";
import { useEffect, useState } from "react";

import { Upload } from "@/hooks/sermonhooks";
import { useQueryClient } from "react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { setSelectedScripture } from "@/redux/sermonAdminSelector";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SelectScripture } from "@/views/admin/sermonadmin/scriptures/selectscriptures";


export function Scripture() {
  const selectedScripture = useSelector(
    (state: RootState) => state.sermonAdmin.selectedScripture
  );
  console.log(selectedScripture);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [headForm, setHeadForm] = useState(
    selectedScripture ? selectedScripture.book : ""
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading: isUploading, mutate: upload } = Upload("updatescripture");
  
  const dispatch = useDispatch();
  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  useEffect(() => {
    setHeadForm(selectedScripture ? selectedScripture.book : "");
    
  }, [selectedScripture]);

  const queryClient = useQueryClient();
  

     
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("book", selectedScripture ? selectedScripture.book : "");

    formData.append("image", uploadedFiles[0]);
    if (selectedScripture) formData.append("scripture_id", selectedScripture.scripture_id);
  
    upload(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Scripture Image Added successfully",
        });
        setIsDialogOpen(true);
        queryClient.invalidateQueries("ScriptureData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding scripture",
        });
        setIsDialogOpen(true);
      },

      onSettled: () => {
        dispatch(setSelectedScripture(null));
        // Executes after mutation is either successful or errors out
        console.log("Mutation is settled");
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  useEffect(() => {

    setCanSubmit(

        uploadedFiles.length > 0 &&
        selectedScripture != null
    );
  }, [headForm, uploadedFiles, selectedScripture]);

  // Determine if the form can be submitted based on name, ministry, and image presence


  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center pt-4">Sermon scripture</h1>
      <div>
        <h2 className="text-xl font-bold mb-4 text-center">
          Edit Book Photo 
        </h2>
      </div>
      <div className='flex justify-center pt-10 pb-5'>
      <SelectScripture />
      </div>
              <div className="grid gap-4 py-4">
             
             
                <div className="grid grid-rows-1 flex justify-center gap-4">
                  <Label
                    htmlFor="typeimage"
                    className="text-center dark:text-white"
                  >
                    Insert Book Image
                  </Label>
                  <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                    <AuthImage
                      onImageUpdate={handleImageUpdate}
                      imgpath={selectedScripture ? selectedScripture.image_path : ""}
                    />
                  </div>
                </div>
              </div>

      <form onSubmit={handleSubmit} className="flex justify-center">
        {isUploading ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Changing Book Photo...
          </Button>
        ) : (
          <Button type="submit" disabled={!canSubmit}>
             Change Book Photo
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
