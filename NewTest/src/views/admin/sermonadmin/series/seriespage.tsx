"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthImage } from "@/views/admin/imagedrop";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Upload } from "@/hooks/sermonhooks";
import { useQueryClient } from "react-query";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Fetch } from "@/hooks/sermonhooks";
import { SeriesType } from "@/types/sermon";
import { EditSeries } from "@/views/admin/sermonadmin/series/editseries";

export function Series() {
  const [headForm, setHeadForm] = useState("");
  const [descForm, setDescForm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [serverResponse, setServerResponse] = useState<{
    success: boolean;
    message: string;
    messageTitle: string;
  } | null>(null);
  const { isLoading, mutate } = Upload("uploadseries");

  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  const { data: seriesData } = Fetch<SeriesType[]>("fetchseries", "SeriesData");
  const queryClient = useQueryClient();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isHeadInItems = seriesData?.some(
      (itemData) => itemData.title === headForm
    );
    if (isHeadInItems) {
      setServerResponse({
        success: false,
        messageTitle: "Error! Duplicate series",
        message: "series already exists",
      });
      setIsDialogOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("head", headForm);
    formData.append("desc", descForm);
    formData.append("image", uploadedFiles[0]);

    mutate(formData, {
      onSuccess: () => {
        // Handle successful mutation
        setServerResponse({
          success: true,
          messageTitle: "Success!",
          message: "Series added successfully",
        });
        setIsDialogOpen(true);
        queryClient.invalidateQueries("SeriesData");
      },
      onError: () => {
        setServerResponse({
          success: false,
          messageTitle: "Error!",
          message: "Error adding Auhtor",
        });
        setIsDialogOpen(true);
      },

      onSettled: () => {
        // Executes after mutation is either successful or errors out
      },
    });
  };

  // Determine if the form can be submitted based on name, ministry, and image presence
  const canSubmit =
    headForm !== "" && descForm !== "" && uploadedFiles.length > 0;

  return (
    <div className="flex flex-col items-center pt-10 bg-slate-50 dark:bg-background h-screen">
      <h1 className="text-2xl font-bold mb-4">Sermon Series</h1>
      <div className="flex flex-row justify-center space-x-4">
        <div className="flex flex-col">
          <Card>
            <CardHeader>
              <CardTitle>
                Create or <EditSeries /> existing.
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>

            <CardContent className="w-fill flex flex-col">
			<div className="flex flex-row pb-4 space-x-10 justify-center">
			<div className="flex flex-col">
				<div className='pb-4'>
                  <Label htmlFor="head" className="font-medium pl-3 pb-1">
                    Title
                  </Label>
                  <Input
                    id="head"
                    placeholder="Enter Title: required"
                    value={headForm}
                    onChange={(e) => setHeadForm(e.target.value)}
                    className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                  />
				  </div>
                  <Label htmlFor="desc" className="font-medium pl-3 pb-1">
                    Description
                  </Label>
                  <Input
                    id="desc"
                    placeholder="Enter Description: required"
                    value={descForm}
                    onChange={(e) => setDescForm(e.target.value)}
                    className="w-[230px] justify-between bg-white text-gray-500 font-normal dark:bg-background dark:text-white"
                  />
                </div>
				</div>
				<div className="border-t-2 pb-2 pt-2"></div>
                  <div className="flex flex-col items-center justify-center">
                    <Label htmlFor="typeimage" className="dark:text-white">
                      Insert series Image
                    </Label>
                    <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
                      <AuthImage onImageUpdate={handleImageUpdate} />
                    </div>
                  </div>
               
              

              <form onSubmit={handleSubmit} className="flex justify-center pt-4">
                {isLoading ? (
                  <Button disabled>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Creating series...
                  </Button>
                ) : (
                  <Button type="submit" disabled={!canSubmit}>
                    Create series
                  </Button>
                )}
              </form>
              {serverResponse && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent>
                    <DialogHeader>{serverResponse.messageTitle}</DialogHeader>
                    <DialogDescription>
                      {serverResponse.message}
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose
                        asChild
                        onClick={() => setServerResponse(null)}
                      >
                        <Button>Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
