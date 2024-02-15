import {
    NavigationMenu,
    
   
    NavigationMenuItem,
   
    NavigationMenuList,
   
  
  } from "@/components/ui/navigation-menu"

import { useTheme } from "@/components/theme-provider";
import Logout from "@/logout"
function AdminNav() {
  const { theme } = useTheme(); 
  return (
    <NavigationMenu>
    <NavigationMenuList className={`NavigationMenuList ${theme} text-center fixed top-0 justify-between inset-x-0`}>
      <NavigationMenuItem className="">
      <Logout/>
        
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
  );
}

export default AdminNav;