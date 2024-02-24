import { Button } from "@/components/ui/button"

import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";

import "@/Styles/SermonNav.css";



function SermonNav() {
  const iconSize = 30;

  return (
    <div className="flex justify-between w-full">
      
          <div className="flex flex-col items-center">
          <Button variant="ghost">
        <div className="flex flex-col items-center">
        <MdUpdate size={iconSize} />
            <span className="text-xs text-center font-normal">Recent</span>
            
        </div>
    </Button>
          </div>
         

         
          <div className="flex flex-col items-center">
          <Button variant="ghost">
        <div className="flex flex-col items-center">
        <FaBookOpen size={iconSize} />
            <span className="text-xs text-center font-normal">Scriptures</span>
            
        </div>
    </Button>
          </div>
         
          <div className="flex flex-col items-center">
    <Button variant="ghost">
        <div className="flex flex-col items-center">
        <FaLayerGroup size={iconSize} />
            <span className="text-xs text-center font-normal">Series</span>
          
        </div>
    </Button>
</div>
          
          <div className="flex flex-col items-center">
          <Button variant="ghost">
        <div className="flex flex-col items-center">
        <IoPersonCircleOutline size={iconSize} />
            <span className="text-xs text-center font-normal">Authors</span>
        </div>
    </Button>
          </div>
       
    
    </div>
  );
}

export default SermonNav;
