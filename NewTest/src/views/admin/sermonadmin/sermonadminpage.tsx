
import {Route, Routes } from "react-router-dom";
import { Author } from "@/views/admin/sermonadmin/author/authorpage";
import {Series} from "@/views/admin/sermonadmin/series/seriespage";
import SermonSideBar from "@/views/admin/sermonadmin/sermonsidebar";
import {Sermon} from "@/views/admin/sermonadmin/sermon/sermon";
import {Topic} from "@/views/admin/sermonadmin/topic/topicpage";
import {Scripture} from "@/views/admin/sermonadmin/scriptures/scripturespage";


function SermonAdminPage() {
  return (
   
     
       <>
      
        
         <div className="flex flex-grow overflow-hidden">
           <div className="bg-background border-r-2 dark:border-none dark:shadow-[rgba(59,130,246,0.8)_0px_3px_15px_4px]">
             <SermonSideBar/>
           </div>
           <div className="flex-grow overflow-auto">
           <Routes>
              <Route path="/" element={<Sermon/>} index/>
              <Route path="sermons" element={<Sermon/>}index />   
              <Route path="authorspage" element={<Author />} /> 
              <Route path="seriespage" element={<Series />} /> 
              <Route path="topicspage" element={<Topic />} /> 
              <Route path="scripturespage" element={<Scripture />} /> 
              </Routes>
           </div>
         </div>
      
     </>
    
  );
}

export default SermonAdminPage;
