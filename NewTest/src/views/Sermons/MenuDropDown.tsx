import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { ModeToggle } from "@/components/mode-toogle";
function MenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu onOpenChange={setIsOpen}>
    <DropdownMenuTrigger>
    <FaBars 
          className={`text-3xl cursor-pointer ${isOpen ? 'transform rotate-90' : ''}`} 
        />
</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Home</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>

        <Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>


          
        </DropdownMenuItem>
        <DropdownMenuItem>Ministries</DropdownMenuItem>
        <DropdownMenuItem>Connect</DropdownMenuItem>
        <DropdownMenuItem>Give</DropdownMenuItem>
        <DropdownMenuItem><ModeToggle/></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MenuDropdown;