import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from "@/views/Sermons/SermonNav";
import Nav from "@/views/sitenav/TopNav";

const Recent = lazy(() => import("@/views/Sermons/SermonRecent"));
const SermonPage = lazy(() => import("@/views/Sermons/Sermon"));
const Series = lazy(() => import("@/views/Sermons/SermonSeries"));
const Authors = lazy(() => import("@/views/Sermons/SermonAuthors"));
const Scriptures = lazy(() => import('./SermonScriptures'));
const Topics = lazy(() => import("@/views/Sermons/SermonTopics"));

function SermonLanding() {
  return (
    <>
      <div className="container">
        <div className="flex sticky top-0  pt-2 pb-1 pl-1 bg-background  border-b-2 dark:shadow-lg dark:shadow-blue-500/50 z-10">
          <Nav />
        </div>
        <div className='flex flex-col'>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Recent/>} index/>
              <Route path="/sermons" element={<Recent/>} index/>
              <Route path="/sermonlistening/:sermonId" element={<SermonPage />} />
              <Route path="/sermonauthors" element={<Authors />} />
              <Route path="/sermonseries" element={<Series />} />
              <Route path="/sermonscriptures" element={<Scriptures />} />
              <Route path="/sermontopics" element={<Topics />} />
            </Routes>
          </Suspense>
       
          <div className="flex fixed bottom-0 w-full pb-1 pl-1 pt-1  bg-background border-t-2 dark:border-none dark:shadow-[rgba(59,130,246,0.8)_0px_3px_15px_4px]  sm:hidden block">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default SermonLanding;