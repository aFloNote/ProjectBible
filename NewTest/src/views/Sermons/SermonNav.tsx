import { Button } from "@/components/ui/button";

import { IoPersonCircleOutline } from "react-icons/io5";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedSermonPage } from "@/redux/sermonSelector";
import "@/Styles/SermonNav.css";

function SermonNav() {
  const iconSize = 30;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );

  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/sermons");
            dispatch(setSelectedSermonPage("sermons")); // Dispatch the action
          }}
        >
          <div className="flex flex-col items-center">
            <TbPodium
              size={iconSize}
              className={
                selectedSermonPage === "sermons"
                  ? "text-black dark:text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "sermons"
                  ? "text-xs text-center font-normal dark:text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Sermons
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button variant="ghost">
          <div className="flex flex-col items-center">
            <FaBookOpen
              size={iconSize}
              className={
                selectedSermonPage === "scriptures"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "scriptures"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Scriptures
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/sermonseries");
            dispatch(setSelectedSermonPage("sermonseries")); // Dispatch the action
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
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
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
        </Button>
      </div>
    </div>
  );
}

export default SermonNav;
