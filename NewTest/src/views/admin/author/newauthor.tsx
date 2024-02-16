"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthImage } from "@/views/admin/author/authimage";

import { useState } from "react";
import { uploadAuthor } from "@/hooks/sermonhooks";

// Import your components here

export function NewAuthor() {
  const [name, setName] = useState("");
  const [ministry, setMinistry] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { data,error,isLoading,mutate } = uploadAuthor();

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData();
    formData.append("name", name);
    formData.append("ministry", ministry);
    formData.append("image", uploadedFiles[0]);
   
    let servResponse = ''
    if (data) {
      servResponse = data.message;
    }
    else if (error) {
      servResponse = error.toString();
    }
    else if (isLoading) {
      servResponse = 'Loading...';
    }

    mutate(formData);
    console.log('asdfsdf',servResponse);
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  const canSubmit = name !== "" && ministry !== "" && uploadedFiles.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Author</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            {/* All your input fields go here */}
            <Button type="submit" disabled={!canSubmit}>
              Add Author
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
