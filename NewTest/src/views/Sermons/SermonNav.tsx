import { Button } from "@/components/ui/button"

import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 
import "@/Styles/SermonNav.css";

function SermonNav() {
  const iconSize = 30;
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );

  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-col items-center">
        <Button variant="ghost">
          <div className="flex flex-col items-center">
            <MdUpdate size={iconSize} className={selectedSermonPage === 'recent' ? 'text-black dark:text-blue-500' : 'text-gray-500'}/>
            <span className={selectedSermonPage === 'recent' ? 'text-xs text-center font-normal dark:text-blue-500' : 'text-xs text-center font-normal text-gray-500'}>Recent</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost">
          <div className="flex flex-col items-center">
            <FaBookOpen size={iconSize} className={selectedSermonPage === 'scriptures' ? 'text-blue-500' : 'text-gray-500'}/>
            <span className={selectedSermonPage === 'scriptures' ? 'text-xs text-center font-normal text-blue-500' : 'text-xs text-center font-normal text-gray-500'}>Scriptures</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost">
          <div className="flex flex-col items-center">
            <FaLayerGroup size={iconSize} className={selectedSermonPage === 'series' ? 'text-blue-500' : 'text-gray-500'}/>
            <span className={selectedSermonPage === 'series' ? 'text-xs text-center font-normal text-blue-500' : 'text-xs text-center font-normal text-gray-500'}>Series</span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost">
          <div className="flex flex-col items-center">
            <IoPersonCircleOutline size={iconSize} className={selectedSermonPage === 'authors' ? 'text-blue-500' : 'text-gray-500'}/>
            <span className={selectedSermonPage === 'authors' ? 'text-xs text-center font-normal text-blue-500' : 'text-xs text-center font-normal text-gray-500'}>Authors</span>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default SermonNav;