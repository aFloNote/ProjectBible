import { Button } from "@/components/ui/button";

import { IoPersonCircleOutline, } from "react-icons/io5";
import {IoIosPaper} from "react-icons/io";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup,FaBookOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedAuthor, setSelectedSeries, setSelectedSermon,setSelectedSermonPage, setSelectedTopic,setSelectedScripture } from "@/redux/sermonAdminSelector";
import "@/Styles/SermonNav.css";

function SermonSideBar() {
  const iconSize = 28;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );
  const selectedColor = "text-primary";
  const darkSelectedColor = "text-blue-500";
  return (
    <div className="flex flex-col justify-start h-screen">
      <div className="flex flex-col items-center pt-10 pb-2">
        <Button
          variant="ghost"
		  className='h-12'
          onClick={() => {
            navigate("/admin/sermons");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedScripture(null));
            dispatch(setSelectedSermonPage("sermons"));
          }}
        >
          <div className="flex flex-col items-center">
            <TbPodium
               size={28}
			   className={
				 selectedSermonPage === "sermons"
				   ? `${selectedColor} dark:${darkSelectedColor}`
				   : "text-gray-500 "
			   }
			 />
			 <span
			   className={
				 selectedSermonPage === "sermons"
				   ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
				   : "text-lg pl-2 text-center font-normal text-gray-500"
			   }
			 >
              Sermons
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center pb-2">
        <Button
		
          variant="ghost"
		  className='h-12'
          onClick={() => {
            navigate("/admin/seriespage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedScripture(null));
            dispatch(setSelectedSermonPage("series"));
          }}
        >
          <div className="flex flex-col items-center">
            <FaLayerGroup
              size={iconSize}
		
			  className={
				selectedSermonPage === "series"
				  ? `${selectedColor} dark:${darkSelectedColor}`
				  : "text-gray-500 "
			  }
			/>
			<span
			  className={
				selectedSermonPage === "series"
				  ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
				  : "text-lg pl-2 text-center font-normal text-gray-500"
			  }
			>
              Series
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center pb-2">
        <Button
		 className='h-12'
          variant="ghost"
          onClick={() => {
            navigate("/admin/authorspage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedScripture(null));
            dispatch(setSelectedSermonPage("authors"));
          }}
        >
          <div className="flex flex-col items-center">
            <IoPersonCircleOutline
             size={28}
			 className={
			   selectedSermonPage === "authors"
				 ? `${selectedColor} dark:${darkSelectedColor}`
				 : "text-gray-500 "
			 }
		   />
		   <span
			 className={
			   selectedSermonPage === "authors"
				 ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
				 : "text-lg pl-2 text-center font-normal text-gray-500"
			 }
		   >
              Authors
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center pb-2">
        <Button
		 className='h-12'
          variant="ghost"
          onClick={() => {
            navigate("/admin/topicspage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedScripture(null));
            dispatch(setSelectedSermonPage("topics"));
          }}
        >
          <div className="flex flex-col items-center">
            <IoIosPaper
              size={iconSize}
			
			  className={
				selectedSermonPage === "topics"
				  ? `${selectedColor} dark:${darkSelectedColor}`
				  : "text-gray-500 "
			  }
			/>
			<span
			  className={
				selectedSermonPage === "topics"
				  ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
				  : "text-lg pl-2 text-center font-normal text-gray-500"
			  }
			>
              Topics
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button
		 className='h-12'
          variant="ghost"
          onClick={() => {
            navigate("/admin/scripturespage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedScripture(null));
            dispatch(setSelectedSermonPage("scriptures"));
          }}
        >
          <div className="flex flex-col items-center">
            <FaBookOpen
              size={iconSize}
			
			  className={
				selectedSermonPage === "scriptures"
				  ? `${selectedColor} dark:${darkSelectedColor}`
				  : "text-gray-500 "
			  }
			/>
			<span
			  className={
				selectedSermonPage === "scriptures"
				  ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
				  : "text-lg pl-2 text-center font-normal text-gray-500"
			  }
			>
              Books
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default SermonSideBar;
