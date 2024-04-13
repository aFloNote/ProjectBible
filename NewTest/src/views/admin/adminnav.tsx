
  import  ModeToggle  from "@/components/mode-toggle";
  import {Logo} from "@/Logos/SiteLogo";
  import { useAuth0 } from "@auth0/auth0-react";
  import {Button} from "@/components/ui/button";

function AdminNav() {
  const { logout } = useAuth0();

 
  
  return (
    <div className='flex columns-3 justify-between w-full'>
        <Logo ratio={16/9} size="6em"/>
   
    
  <div className='flex justify-end items-center'>
  <Button className='' variant="ghost" onClick={() => logout({ logoutParams: { returnTo: "https://fbctreasurevalley.net/admin" } })}>
    Logout
    </Button>
    <div className='pr-10'> 
    <ModeToggle />
    </div>
    </div>
  </div>
  );
}

export default AdminNav;