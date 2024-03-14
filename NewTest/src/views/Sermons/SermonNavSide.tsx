
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

function SermonNavSide() {
  const iconSize = 50;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );

  return (
   <div className="flex flex-col justify-start h-screen">
      <div className="flex flex-col">
        <div
          className="px-5"
          onClick={() => {
            navigate("/sermons");
            dispatch(setSelectedSermonPage("sermons")); // Dispatch the action
          }}
        >
          <div className="flex flex-col">
            <TbPodium
              size={iconSize}
              className={
                selectedSermonPage === "sermons"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermons"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Sermons
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className="px-0 pt-10"
          onClick={() => {
            navigate("/sermonscriptures");
            dispatch(setSelectedSermonPage("sermonscriptures"));
          }}
        >
          <div className="flex flex-col items-center">
            <FaBookOpen
              size={iconSize}
              className={
                selectedSermonPage === "sermonscriptures"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermonscriptures"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Scriptures
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div
          className="px-0 bg-none pt-10"
          onClick={() => {
            navigate("/sermonseries");
            dispatch(setSelectedSermonPage("sermonseries"));
            // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <FaLayerGroup
              size={iconSize}
              className={
                selectedSermonPage === "sermonseries"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermonseries"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Series
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <div
          className="px-0 w-full"
          onClick={() => {
            navigate("/sermontopics");
            dispatch(setSelectedSermonPage("sermontopics")); // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <MdFormatListBulleted
              size={iconSize}
              className={
                selectedSermonPage === "sermontopics"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermontopics"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Topics
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <div
          className="px-0 w-full"
          onClick={() => {
            navigate("/sermonauthors");
            dispatch(setSelectedSermonPage("sermonauthors")); // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <IoPersonCircleOutline
              size={iconSize}
              className={
                selectedSermonPage === "sermonauthors"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermonauthors"
                  ? "text-xs text-center font-normal text-blue-500"
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

export default SermonNavSide;
