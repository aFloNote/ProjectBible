import {
    NavigationMenu,
    
   
    NavigationMenuItem,
   
    NavigationMenuList,
   
  
  } from "@/components/ui/navigation-menu"
  import { ModeToggle } from "@/components/mode-toggle";
  import {Logo} from "@/Logos/SiteLogo";
  

import Logout from "@/logout"
function AdminNav() {
 
 
  
  return (
    <NavigationMenu className="shadow-sm">
    <NavigationMenuList className={`fixed top-0 inset-x-0 pt-1 pb-1 pl-1 pr-4 flex justify-between`}>
    <NavigationMenuItem>
      <Logo ratio={16/9} size="8em"/>
    </NavigationMenuItem>
      <NavigationMenuItem>
      <Logout/>
      </NavigationMenuItem>
      <NavigationMenuItem>
    <ModeToggle/>
      </NavigationMenuItem>
      
    </NavigationMenuList>
  </NavigationMenu>
  );
}

export default AdminNav;