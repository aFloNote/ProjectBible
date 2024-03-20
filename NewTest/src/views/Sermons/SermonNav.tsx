
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdFormatListBulleted } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import "@/Styles/SermonNav.css";

function SermonNav() {
  const iconSize = 30;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );
  const selectedColor='text-primary'
  const darkSelectedColor='text-blue-500'
  return (
    <div className="flex justify-between w-full px-2">
      <div className="flex flex-col items-center w-1/5 cursor-pointer">
        <div
          className=" w-full"
          onClick={() => {
            navigate("/sermons");
            dispatch(setSelectedSermonPage("sermons")); // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center ">
            <TbPodium
              size={iconSize}
              className={
                selectedSermonPage === "sermons"
                  ? `${selectedColor} dark:${darkSelectedColor}`
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermons"
                  ? `text-xs text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Sermons
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/5 cursor-pointer">
        <div
          className="px-0 w-full"
          onClick={() => {
            navigate("/scriptures");
            dispatch(setSelectedSermonPage("scriptures"));
          }}
        >
          <div className="flex flex-col items-center">
            <FaBookOpen
              size={iconSize}
              className={
                selectedSermonPage === "scriptures"
                  ? `${selectedColor} dark:${darkSelectedColor}`
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "scriptures"
				? `text-xs text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Scriptures
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/5 bg-none cursor-pointer">
        <div
          className="px-0 bg-none w-full"
          onClick={() => {
            navigate("/series");
            dispatch(setSelectedSermonPage("series"));
            // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <FaLayerGroup
              size={iconSize}
              className={
                selectedSermonPage === "series"
                  ? `${selectedColor} dark:${darkSelectedColor}`
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "series"
				? `text-xs text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Series
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/5 cursor-pointer">
        <div
          className="px-0 w-full"
          onClick={() => {
            navigate("/topics");
            dispatch(setSelectedSermonPage("topics")); // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <MdFormatListBulleted
              size={iconSize}
              className={
                selectedSermonPage === "topics"
                  ? `${selectedColor} dark:${darkSelectedColor}`
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "topics"
				? `text-xs text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Topics
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center w-1/5 cursor-pointer">
        <div
          className="px-0 w-full"
          onClick={() => {
            navigate("/authors");
            dispatch(setSelectedSermonPage("authors")); // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <IoPersonCircleOutline
              size={iconSize}
              className={
                selectedSermonPage === "authors"
                  ? `${selectedColor} dark:${darkSelectedColor}`
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "authors"
				? `text-xs text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Authors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SermonNav;
