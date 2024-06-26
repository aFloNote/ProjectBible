import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import { SiteImage } from "@/image";
import { Audio } from "@/components/audioplayer";
import 'react-h5-audio-player/lib/styles.css';
import { useDispatch } from "react-redux";
import { setSelectedSermonPage } from "@/redux/sermonAdminSelector";
import {
	Card,
	CardContent,
   
  } from "@/components/ui/card"

export function SermonPage() {
	
  const navigate = useNavigate();
  const { sermonId } = useParams<{ sermonId: string }>();
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
  const dispatch=useDispatch();
  useEffect(() => {
	dispatch(setSelectedSermonPage(""));
  }, [dispatch]);


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
  let month="";
  let day=0;
  let year=0;
 if (sermonFull){
  let date = new Date(sermonFull[0].SermonType.date_delivered);
     month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    day = date.getUTCDate();
    // @ts-ignore
    year = date.getUTCFullYear();
 }

  if (!sermonFull) {
    return <div>Loading...</div>;
  }

  return (
	
	
	<Card>
		<div className='pb-0'  >
			<CardContent>	
    <div className="flex flex-col"> 
      <div className="">
        {sermonFull.length > 0 && sermonFull[0].SeriesType.image_path && (
          <SiteImage
            divClass='w-full max-w-lg px-4 mx-auto pt-4'
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
		
            <h2 className="text-xl text-center leading-none">
              {sermonFull[0].SermonType.title}
            </h2>
            <div className="text-center leading-none">
              <p className="text-gray-500 text-lg text-center font-medium leading-none">
                {sermonFull[0].SeriesType.description}
              </p>
            </div>
            <div className="text-gray-500 text-center text-md">
              {sermonFull[0].AuthorType.name}
            </div>
			<div className='flex text-center leading-tight pt-2'>
				
				<div className="flex flex-row items-center mx-auto">
			  <div className='text-center text-gray-400 leading-none text-sm  pr-1'>{month}</div>
			  <div className='text-center text-gray-400 text-sm  leading-none'>{day}</div>
			  <div className='text-center text-gray-400 leading-none text-sm pl-1'>{year}</div>
			  </div>
					  
					  </div>
          </div>
        </div>
      </div>
      <div className=""> {/* Audio player container */}
        <Audio audio_link={sermonFull[0].SermonType.audio_path} sermonFull={sermonFull}/>
      </div>
    </div>
	</CardContent>
	</div>

	</Card>
  );
}
export default SermonPage;