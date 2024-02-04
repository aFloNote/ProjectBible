import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaBars } from 'react-icons/fa';
import { useState } from 'react';
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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MenuDropdown;