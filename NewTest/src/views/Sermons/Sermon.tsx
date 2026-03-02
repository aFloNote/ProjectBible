import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";
import { SiteImage } from "@/image";
import { Audio } from "@/components/audioplayer";
import 'react-h5-audio-player/lib/styles.css';
import { useDispatch } from "react-redux";
import { setSelectedSermonPage } from "@/redux/sermonAdminSelector";
import { FiArrowLeft } from "react-icons/fi";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
    `pubfetchsermons?sermon_slug=${sermonId}`,
    sermonId || "SermonFull",
    false,   
  );
  console.log(sermonFull)
  let month="";
  let day=0;
  let year=0;
 if (sermonFull){
  
  const dateString = sermonFull[0].SermonType.date_delivered.split("T")[0];
  const [yearFor, monthFor, dayFor] = dateString.split("-").map(Number);

  // Create a local date (month is 0-based in JS)
  	let date = new Date(yearFor, monthFor - 1, dayFor);
    month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    day = date.getUTCDate();
    // @ts-ignore
    year = date.getUTCFullYear();
 }

  if (!sermonFull) {
    return <div>Loading...</div>;
  }

  return (
	<div className='mx-auto max-w-lg h-screen'>
	<div className='pb-0 pt-5'  >
	<Link to="/sermons" className="absolute top-0 left-0 p-4">
        <FiArrowLeft size={24} />
      </Link>
    <div className="flex flex-col pt-5 h-lvh"> 
	<ScrollArea className="flex-1 overflow-auto">
      <div className="">
        {sermonFull.length > 0 && sermonFull[0].SeriesType.image_path && (
          <SiteImage
            divClass='w-64 h-64 max-[320px]:h-64 max-[320px]:w-64 mx-auto'
            ratio={1/1}
            alt='Series Image'
            source={
              b2endpoint +
              encodeURIComponent(sermonFull[0].SeriesType.image_path)
            }
          />
        )}
        <div className="pt-2">
          <div className="col-span-4 leading-tight pb-1">
		
            <h2 className="whitespace-nowrap overflow-ellipsis overflow-hidden text-xl text-center leading-tight">
              {sermonFull[0].SermonType.title}
            </h2>
            <div className="text-center leading-tight">
              <p className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-500 text-lg text-center font-medium leading-tight">
                {sermonFull[0].SeriesType.title}
              </p>
            </div>
            <div className="text-gray-500 text-center leading-tight text-md">
              {sermonFull[0].AuthorType.name}
            </div>
			<div className="whitespace-nowrap overflow-ellipsis overflow-hidden text-gray-500 text-center text-primary leading-tight text-sm">
              {sermonFull[0].SermonType.scripture}
            </div>
			<div className='flex text-center leading-none pt-2'>
			
				<div className="flex flex-row items-center mx-auto">
			  <div className='text-center text-gray-400 leading-none text-sm  pr-1'>{month}</div>
			  <div className='text-center text-gray-400 text-sm  leading-none'>{day},</div>
			  <div className='text-center text-gray-400 leading-none text-sm pl-1'>{year}</div>
			  </div>
					  
					  </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col"> {/* Audio player container */}
        <Audio audio_link={sermonFull[0].SermonType.audio_path} text_link={sermonFull[0].SermonType.text_path} sermonFull={sermonFull}/>
      </div>
	  </ScrollArea>
    </div>

	</div>

	
	</div>
  );
}
export default SermonPage;