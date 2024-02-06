import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

import { useTheme } from "@/components/theme-provider";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen, FaSearch } from "react-icons/fa";
import Logo from "@/Logos/MobileLogo";
import "@/Styles/TopNav.css";
import React from "react";


function TopBar() {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const themeClass = isDark ? "dark" : "light";
  const iconSize = 20;

  return (
      <NavigationMenu className="sm:hidden block">
      <NavigationMenuList className={`NavigationMenuList ${themeClass} text-center fixed top-0 inset-x-0 pt-1 pb-1 pl-1 flex justify-between`}>

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
