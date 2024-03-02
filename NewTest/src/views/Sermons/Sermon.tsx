import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import { SiteImage } from "@/image";
import { Audio } from "@/components/audioplayer";
import 'react-h5-audio-player/lib/styles.css';

export function SermonPage() {
  const navigate = useNavigate();
  const { sermonId } = useParams<{ sermonId: string }>();
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  console.log(sermonId);
  useEffect(() => {
    if (!sermonId) {
      navigate("/"); // redirect to home page if no sermon is selected
    }
  }, [sermonId, navigate]);

  const { data: sermonFull } = Fetch<SermonFullType[]>(
    `pubfetchsermons?sermon_id=${sermonId}`,
    sermonId || "SermonFull",
    false,   
  );
 


  if (!sermonFull) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col"> 
      <div className="">
        {sermonFull.length > 0 && sermonFull[0].SeriesType.image_path && (
          <SiteImage
            divClass='w-full max-w-screen-lg px-4 mx-auto pt-4'
            ratio={16/9}
            alt='Series Image'
            source={
              b2endpoint +
              encodeURIComponent(sermonFull[0].SeriesType.image_path)
            }
          />
        )}
        <div className="pt-2">
          <div className="col-span-4 leading-none pb-1 pl-4">
            <h2 className="text-lg text-center leading-none">
              {sermonFull[0].SermonType.title}
            </h2>
            <div className="text-center">
              <p className="text-gray-500 text-sm text-center font-medium">
                {sermonFull[0].SeriesType.description}
              </p>
            </div>
            <div className="text-gray-500 text-center font-bold text-xs">
              {sermonFull[0].AuthorType.name}
            </div>
          </div>
        </div>
      </div>
      <div className=""> {/* Audio player container */}
        <Audio audio_link={sermonFull[0].SermonType.audio_link} sermonFull={sermonFull}/>
      </div>
    </div>
  );
}
