import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,

} from "@/components/ui/navigation-menu";

import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen, FaSearch } from "react-icons/fa";
import Logo from "@/Logos/MobileLogo";




function TopBar() {
  
  const iconSize = 20;

  return (
      <NavigationMenu className="sm:hidden block">
      <NavigationMenuList className={`className="flex fixed top-0 inset-x-0 pt-1 pb-1 pl-1 pr-4 justify-between bg-background shadow-lg dark:shadow-blue-500/50`}>

    <NavigationMenuItem>
      <Logo />
    </NavigationMenuItem>

  


 

    <NavigationMenuItem>
      <NavigationMenuLink
        href="https://github.com/radix-ui"
        className={`${navigationMenuTriggerStyle()}`}
      >
        <FaBookOpen size={iconSize} />
      </NavigationMenuLink>
    </NavigationMenuItem>


    

  
    </NavigationMenuList>
</NavigationMenu>
  );
}

export default TopBar
