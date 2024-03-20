import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdFormatListBulleted } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import "@/Styles/SermonNav.css";

function SermonNavSide() {
  const iconSize = 25;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );
  const selectedColor = "text-primary";
  const darkSelectedColor = "text-blue-500";
  return (
    <div className="flex flex-col justify-start h-screen">
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex flex-row">
          <div
            className="px-0 pt-5"
            onClick={() => {
              navigate("/sermons");
              dispatch(setSelectedSermonPage("sermons")); // Dispatch the action
            }}
          >
            <div className="flex flex-row">
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
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className="px-0 pt-5"
            onClick={() => {
              navigate("/scriptures");
              dispatch(setSelectedSermonPage("scriptures"));
            }}
          >
            <div className="flex flex-row">
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
                    ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                    : "text-lg pl-2 text-center font-normal text-gray-500"
                }
              >
                Scriptures
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className="px-0 bg-none pt-5"
            onClick={() => {
              navigate("/series");
              dispatch(setSelectedSermonPage("series"));
              // Dispatch the action
            }}
          >
            <div className="flex flex-row ">
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
                    ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                    : "text-lg pl-2 text-center font-normal text-gray-500"
                }
              >
                Series
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div
            className="px-0"
            onClick={() => {
              navigate("/topics");
              dispatch(setSelectedSermonPage("topics")); // Dispatch the action
            }}
          >
            <div className="flex flex-row">
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
                    ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                    : "text-lg pl-2 text-center font-normal text-gray-500"
                }
              >
                Topics
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div
            className="px-0"
            onClick={() => {
              navigate("/authors");
              dispatch(setSelectedSermonPage("authors")); // Dispatch the action
            }}
          >
            <div className="flex flex-row">
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
                    ? `text-lg pl-2 text-center font-normal ${selectedColor} dark:${darkSelectedColor}`
                    : "text-lg pl-2 text-center font-normal text-gray-500"
                }
              >
                Authors
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default SermonNavSide;
