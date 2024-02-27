import { Route, Routes } from 'react-router-dom';
import {Recent} from "@/views/Sermons/SermonRecent";
import {SermonPage} from "@/views/Sermons/Sermon";
import Footer from "@/views/Sermons/SermonNav";
import Nav from "@/views/sitenav/TopNav";


function SermonLanding() {
  return (
    <>
      <div className="container">
        <div className="flex sticky top-0  pt-2 pb-1 pl-1 bg-background shadow-lg dark:shadow-blue-500/50 z-10">
          <Nav />
        </div>
        <div className='flex flex-col'>
          <Routes>
            <Route path="/" element={<Recent/>} index/>
            <Route path="/Sermon/:sermonId" element={<SermonPage />} />
          </Routes>
       
          <div className="flex fixed w-full bottom-0 pb-1 pl-1 pt-1  bg-background border-t-2 dark:border-none dark:shadow-[rgba(59,130,246,0.8)_0px_3px_15px_4px]  sm:hidden block">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
export default SermonLanding;