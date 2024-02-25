import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';


import { Fetch } from "@/hooks/sermonhooks";
import { SermonFullType } from "@/types/sermon";


export function SermonPage() {
  const navigate = useNavigate();
  const { sermonId } = useParams<{ sermonId: string }>();
  
  useEffect(() => {
    if (!sermonId) {
      navigate('/'); // redirect to home page if no sermon is selected
    }
  }, [sermonId, navigate]);
 
  const { data: sermonFull } = Fetch<SermonFullType>(
    `pubfetchsermons?sermon_id=${sermonId}`,
    "SeriesAuthorData",
    false
);
console.log(JSON.stringify(sermonFull, null, 2))
  useEffect(() => {
    console.log("asdfsadfsd "+sermonFull);
  }, [sermonFull]);

  // Render the sermon details
  return (
   
    <div>
     
    </div>
    
  );
    
}