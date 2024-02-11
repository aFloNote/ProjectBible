import {
    NavigationMenu,
    NavigationMenuContent,
   
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  
  } from "@/components/ui/navigation-menu"

import { useTheme } from "@/components/theme-provider";
function AdminNav() {
  const { theme } = useTheme(); 
  return (
    <NavigationMenu>
    <NavigationMenuList className={`NavigationMenuList ${theme} text-center fixed top-0 inset-x-0 pt-2 flex justify-between`}>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink>Link</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  );
}

export default AdminNav;