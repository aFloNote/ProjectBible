
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // re
import { Label } from "@/components/ui/label";
import { AuthImage } from "@/views/admin/imagedrop";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export function Sermon() {
  const selectedAuthor = useSelector(
    (state: RootState) => state.selected.selectedAuthor
  );
  const selectedSeries = useSelector(
    (state: RootState) => state.selected.selectedSeries
  );

  console.log("Selected Series:", selectedSeries);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const handleImageUpdate = (files: File[]) => {
    setUploadedFiles(files);
  };
  return (
    <>
  <h1 className="text-2xl font-semibold">Sermons</h1>
  <p className="mt-1">Create a Sermon</p>

  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
    <div className="sm:col-span-3">
      <Label className="block text-sm font-medium text-gray-700">
        Selected Author
      </Label>
      <div className="mt-1">
        <p className="text-sm text-gray-900">{selectedAuthor ? selectedAuthor.name : 'No Author Selected'}</p>
      </div>
    </div>

    
      <div className="mt-1 border-dashed border-2 border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500">
        <AuthImage onImageUpdate={handleImageUpdate} />
      </div>
    </div>

  </>


  );
}
export default Sermon;
