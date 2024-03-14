
import { ModeToggle } from "@/components/mode-toggle";
import {Logo} from "@/Logos/SiteLogo";
import  ErrorBoundary  from "@/components/error";


import Search from "@/components/search";

function TopNav() {
	



return (
  <div className='flex columns-3 justify-between w-full'>
      
      <Logo ratio={16/9} size="6em"/>
 
	  <div className='pt-2 pr-2 pt-3'>
     
	 <ErrorBoundary>
	   <Search />
	 </ErrorBoundary>
		 
		
		 </div>
<div className='flex justify-end'>
<div className='pt-2 pr-2 pt-3'>
     

   
    </div>
  <div className='pt-2 pr-2'> 
  <ModeToggle/>
  </div>
  </div>
</div>
);
}

export default TopNav;