import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import { Image } from "@/image";
import DateComp from "@/views/formatting/sermondate";

import { Audio } from "@/components/audioplayer";


import 'react-h5-audio-player/lib/styles.css';

export function SermonPage() {
  const navigate = useNavigate();
  const { sermonId } = useParams<{ sermonId: string }>();
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;

  useEffect(() => {
    if (!sermonId) {
      navigate("/"); // redirect to home page if no sermon is selected
    }
  }, [sermonId, navigate]);

  const { data: sermonFull } = Fetch<SermonFullType[]>(
    `pubfetchsermons?sermon_id=${sermonId}`,
    "SeriesAuthorData",
    false
  );

  // If sermonFull is not loaded yet, return a loading message
  if (!sermonFull) {
    return <div>Loading...</div>;
  }


  // Render the sermon details
  return (
    <>
      <div className="w-full pt-3 flex justify-center items-center">
        {sermonFull.length > 0 && sermonFull[0].SeriesType.image_path && (
          <Image
            ratio={2}
            size="100%"
            source={
              b2endpoint +
              encodeURIComponent(sermonFull[0].SeriesType.image_path)
            }
            className="flex justify-center rounded-md object-cover"
          />
        )}
      </div>
      <div className="pt-2">
        <div className="col-span-4 leading-none pb-1 pl-4">
          <h2 className="text-sm leading-none">
            {sermonFull[0].SermonType.title}
          </h2>
          <p className="text-gray-500 font-medium text-xs">
            {sermonFull[0].SeriesType.description}
          </p>
         
            <div className="text-gray-500 text-xs">
              <DateComp date={sermonFull[0].SermonType.date_delivered} />
            </div>
            <div className="text-gray-500 font-bold text-xs">
              {sermonFull[0].AuthorType.name}
            </div>
        </div>
        <div className="border-t"></div>
       
        <div>
            <Audio audio_link={sermonFull[0].SermonType.audio_link}/>
        </div>
      </div>
    </>
  );
}
