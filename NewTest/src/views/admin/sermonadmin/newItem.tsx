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
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState} from "react";
import { Upload} from "@/hooks/sermonhooks";
import { useQueryClient } from 'react-query';

interface NewItemProps {
  items:any[];
  type:string;
  head:string;
  desc:string
  error: Error | null;
}

export function NewItem({ items,type,head,desc }: NewItemProps) {
 
  const [headForm, setHeadForm] = useState("");
  const [descForm, setDescForm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading,mutate } = Upload('upload'+type.toLowerCase());

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const queryClient = useQueryClient();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('itmes'+JSON.stringify(items));
    const isHeadInItems = items.some((itemData) => itemData[head] === headForm);
    if (isHeadInItems) {
      setServerResponse({
        success: false,
        messageTitle:'Error! Duplicate '+type,
        message: type+" already exists",
      });
      return;
    }
    

    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    formData.append("image", uploadedFiles[0]);
    
    mutate(formData, {
     

      

      onSuccess: (data) => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle:'Success!',
          message: type+" added successfully",
        });
        queryClient.invalidateQueries(type+'Data');
        console.log("Success data:", data);
      },
      onError: (error) => {
        setServerResponse({ success: false, messageTitle:'Error!', message: "Error adding "+type });
        console.log("Error:", error);
      },

      onSettled: () => {
        // Executes after mutation is either successful or errors out
        console.log("Mutation is settled");
        
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  const canSubmit = head !== "" && desc !== "" && uploadedFiles.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create {type}</Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[225px]">
        {serverResponse ? (
          <>
            <DialogHeader>
              <DialogTitle>{serverResponse.messageTitle}</DialogTitle>
              <DialogDescription>{serverResponse.message}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
            <DialogClose asChild onClick={() => setServerResponse(null)}>
            <Button>
              Close
            </Button>
          </DialogClose>
            </DialogFooter>
          </>
        ) :(
          <>
            <DialogHeader>
              <DialogTitle>Create New {type}</DialogTitle>
              <DialogDescription>
                Add an {head}, {desc}, and image, then click add {type}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="head" className="text-left">
                  {head.charAt(0).toUpperCase()+head.slice(1)}
                </Label>
                <Input
                  id="head"
                  value={headForm}
                  onChange={(e) => setHeadForm(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-left">
                  {desc.charAt(0).toUpperCase()+desc.slice(1)}
                </Label>
                <Input
                  id="desc"
                  value={descForm}
                  onChange={(e) => setDescForm(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-rows-1 flex justify-center gap-4">
                <Label htmlFor="typeimage" className="text-center dark:text-white">
                  Insert {type} Image
                </Label>
                <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                  <AuthImage onImageUpdate={handleImageUpdate} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <form onSubmit={handleSubmit}>
              {isLoading ? (
                   <Button disabled>
                   <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                   Adding {type}...
                 </Button>):(
                <Button type="submit" disabled={!canSubmit}>
                  Add {type}
                </Button>
              )}
              </form>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
