
import { Logo } from "@/Logos/SiteLogo";

import MenuNav from "@/views/sitenav/navmenu";

function TopNav() {
  return (
    <div className="flex columns-3 justify-between w-full">
      <Logo ratio={16 / 9} size="6em" />

      <div className="pt-5 pr-2 pt-3 lg:pt-6 "></div>
      <div className="flex justify-end">
        <div className="flex pr-5 lg:pt-7 ">
          <MenuNav />
        </div>
      
      
     
        
      </div>
    </div>
  );
}

export default TopNav;
