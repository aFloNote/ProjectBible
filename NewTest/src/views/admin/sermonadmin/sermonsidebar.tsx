import { Button } from "@/components/ui/button";

import { IoPersonCircleOutline, } from "react-icons/io5";
import {IoIosPaper} from "react-icons/io";
import { TbPodium } from "react-icons/tb";
import { FaLayerGroup,FaBookOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedAuthor, setSelectedSeries, setSelectedSermon,setSelectedSermonPage, setSelectedTopic } from "@/redux/sermonAdminSelector";
import "@/Styles/SermonNav.css";

function SermonSideBar() {
  const iconSize = 30;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSermonPage = useSelector(
    (state: RootState) => state.sermon.selectedSermonPage
  );

  return (
    <div className="flex flex-col justify-start h-screen">
      <div className="flex flex-col items-center pt-10 pb-4">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/sermons");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedSermonPage("sermons"));
          }}
        >
          <div className="flex flex-col items-center">
            <TbPodium
              size={iconSize}
              className={
                selectedSermonPage === "sermons"
                ? "text-xs text-center font-normal text-blue-500"
                : "text-xs text-center font-normal text-gray-500"
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
        </Button>
      </div>
      <div className="flex flex-col items-center pb-4">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/seriespage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedSermonPage("series"));
          }}
        >
          <div className="flex flex-col items-center">
            <FaLayerGroup
              size={iconSize}
              className={
                selectedSermonPage === "series"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "series"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Series
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center pb-4">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/authorspage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedSermonPage("authors"));
          }}
        >
          <div className="flex flex-col items-center">
            <IoPersonCircleOutline
              size={iconSize}
              className={
                selectedSermonPage === "authors"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "authors"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Authors
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center pb-4">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/topicspage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedSermonPage("topics"));
          }}
        >
          <div className="flex flex-col items-center">
            <IoIosPaper
              size={iconSize}
              className={
                selectedSermonPage === "topics"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <span
              className={
                selectedSermonPage === "topics"
                  ? "text-xs text-center font-normal text-blue-500"
                  : "text-xs text-center font-normal text-gray-500"
              }
            >
              Topics
            </span>
          </div>
        </Button>
      </div>
      <div className="flex flex-col items-center pb-4">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/scripturespage");
            dispatch(setSelectedAuthor(null));
            dispatch(setSelectedSeries(null));
            dispatch(setSelectedSermon(null));
            dispatch(setSelectedTopic(null));
            dispatch(setSelectedSermonPage("scriptures"));
          }}
        >
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
    </div>
  );
}

export default SermonSideBar;
