
import {Route, Routes } from "react-router-dom";
import Nav from "@/views/admin/adminnav";

import SermonAdminPage from "@/views/admin/sermonadmin/sermonadminpage";


function Admin() {
  return (
   
     //somesomment
       <>
       <div className="flex flex-col h-screen">
         <div className="flex sticky top-0 pt-2 pb-1 pl-1 bg-background  border-b-2 dark:shadow-lg dark:shadow-blue-500/50 z-10">
           <Nav />
         </div>
        
           <div className="flex-grow px-4 overflow-auto">
           <Routes>
              <Route path="*" element={<SermonAdminPage/>}/>
            
          </Routes>
         
         </div>
       </div>
     </>
    
  );
}

export default Admin;
