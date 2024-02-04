import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { useTheme } from "@/components/theme-provider";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen} from "react-icons/fa";
import "@/views/Sermons/SermonNavBar.css";




function NavBar() {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const themeClass = isDark ? "dark" : "light";
  const iconSize = 20;

  return (
    
        <NavigationMenu className="fixed bottom-0 w-screen sm:hidden block">
        <NavigationMenuList className={`NavigationMenuList ${themeClass}`}>

      <NavigationMenuItem>
        <NavigationMenuLink
          href="https://github.com/radix-ui"
          className={`${navigationMenuTriggerStyle()}`}
        >
          <MdUpdate size={iconSize} />
        </NavigationMenuLink>
      </NavigationMenuItem>

    

      <NavigationMenuItem>
        <NavigationMenuLink
          href="https://github.com/radix-ui"
          className={`${navigationMenuTriggerStyle()}`}
        >
          <MdUpdate size={iconSize} />
        </NavigationMenuLink>
      </NavigationMenuItem>

   

      <NavigationMenuItem>
        <NavigationMenuLink
          href="https://github.com/radix-ui"
          className={`${navigationMenuTriggerStyle()}`}
        >
          <FaBookOpen size={iconSize} />
        </NavigationMenuLink>
      </NavigationMenuItem>


      <NavigationMenuItem>
        <NavigationMenuLink
          href="https://github.com/radix-ui"
          className={`${navigationMenuTriggerStyle()}`}
        >
          <FaLayerGroup size={iconSize} />
        </NavigationMenuLink>
      </NavigationMenuItem>

      

      <NavigationMenuItem>
        <NavigationMenuLink
          href="https://github.com/radix-ui"
          className={`${navigationMenuTriggerStyle()}`}
        >
          <IoPersonCircleOutline size={iconSize} />
        </NavigationMenuLink>
      </NavigationMenuItem>

      

    
      </NavigationMenuList>
  </NavigationMenu>
 
   
  );}

export default NavBar;
