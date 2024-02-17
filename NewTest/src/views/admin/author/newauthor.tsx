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
import { AuthImage } from "@/views/admin/author/authimage";
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState} from "react";
import { uploadAuthor, Author} from "@/hooks/sermonhooks";
import { useQueryClient } from 'react-query';

interface NewAuthorProps {
  authorsData: Author[];
  error: Error | null;
}

export function NewAuthor({ authorsData }: NewAuthorProps) {
 
  const [name, setName] = useState("");
  const [ministry, setMinistry] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading,mutate } = uploadAuthor();

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const queryClient = useQueryClient();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const isNameInAuthors = authorsData.some((authorData) => authorData.name === name);
    if (isNameInAuthors) {
      setServerResponse({
        success: false,
        messageTitle:'Error! Duplicate Author',
        message: "Author name already exists",
      });
      return;
    }
    

    const formData = new FormData();
    formData.append("name", name);
    formData.append("ministry", ministry);
    formData.append("image", uploadedFiles[0]);
    
    mutate(formData, {
     

      

      onSuccess: (data) => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle:'Success!',
          message: "Author added successfully",
        });
        queryClient.invalidateQueries('AuthorData');
        console.log("Success data:", data);
      },
      onError: (error) => {
        setServerResponse({ success: false, messageTitle:'Error!', message: "Error adding author" });
        console.log("Error:", error);
      },

      onSettled: () => {
        // Executes after mutation is either successful or errors out
        console.log("Mutation is settled");
        
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  const canSubmit = name !== "" && ministry !== "" && uploadedFiles.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Author</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
              <DialogTitle>Create New Author</DialogTitle>
              <DialogDescription>
                Add an author name, ministry, and image, then click save.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ministry" className="text-right">
                  Ministry
                </Label>
                <Input
                  id="ministry"
                  value={ministry}
                  onChange={(e) => setMinistry(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-rows-1 items-center gap-4">
                <Label htmlFor="authorimage" className="text-center">
                  Insert Author Image
                </Label>
                <div className="border-dashed border-2 border-gray-300 bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200">
                  <AuthImage onImageUpdate={handleImageUpdate} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <form onSubmit={handleSubmit}>
              {isLoading ? (
                   <Button disabled>
                   <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                   Adding Author
                 </Button>):(
                <Button type="submit" disabled={!canSubmit}>
                  Add Author
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
