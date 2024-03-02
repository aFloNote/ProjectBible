import {
  NavigationMenu,
  
 
  NavigationMenuItem,
 
  NavigationMenuList,
 

} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/mode-toggle";
import {Logo} from "@/Logos/SiteLogo";



function TopNav() {




return (
  <div className='flex columns-3 justify-between w-full'>
      
      <Logo ratio={16/9} size="6em"/>
 
  <NavigationMenu>
  <NavigationMenuList className="">

  
  
   

    <NavigationMenuItem>
  
    </NavigationMenuItem>

    <NavigationMenuItem>
    
    </NavigationMenuItem>
    
    
  </NavigationMenuList>
</NavigationMenu>
<div className='flex justify-end'>
  <div className='pt-2 pr-2'> 
  <ModeToggle/>
  </div>
  </div>
</div>
);
}

export default TopNav;