"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {AuthImage} from '@/views/admin/author/authimage'



import  { useState } from 'react';
// Import your components here

export function NewAuthor() {
    const [name, setName] = useState('');
    const [ministry, setMinistry] = useState('');

    return (
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create Author</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Author</DialogTitle>
            <DialogDescription>
              Add a author name, ministry and image, then click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ministry" className="text-right">
                Ministry
              </Label>
              <Input id="ministry" value={ministry} onChange={(e) => setMinistry(e.target.value)} className="col-span-3" />
            </div>
                    <div className="grid grid-rows-1 items-center gap-4">
                        <Label htmlFor="authorimage" className="text-center">
                            Insert Author Image
                        </Label>
                        <div className="border-dashed border-2 border-gray-300 bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200">
                        <AuthImage />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
      </Dialog>
    );
}
