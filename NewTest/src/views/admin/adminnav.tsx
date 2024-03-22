import {
    NavigationMenu,
    
   
    NavigationMenuItem,
   
    NavigationMenuList,
   
  
  } from "@/components/ui/navigation-menu"
  import  ModeToggle  from "@/components/mode-toggle";
  import {Logo} from "@/Logos/SiteLogo";
  import { useAuth0 } from "@auth0/auth0-react";
  import {Button} from "@/components/ui/button";
  import { useState } from "react";
function AdminNav() {
  const { logout } = useAuth0();
  const [isClicked, setIsClicked] = useState(false);
 
  
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
  <Button className='' variant="ghost" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
    Logout
    </Button>
    <div className='pt-2 pr-1'> 
    <ModeToggle setIsClicked={setIsClicked}/>
    </div>
    </div>
  </div>
  );
}

export default AdminNav;