import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "@/views/Sermons/SermonNav";
import Nav from "@/views/sitenav/TopNav";
import Side from "@/views/Sermons/SermonNavSide";
import { SearchPage } from "@/components/searchpage";

const Recent = lazy(() => import("@/views/Sermons/SermonRecent"));
const SermonPage = lazy(() => import("@/views/Sermons/Sermon"));
const Series = lazy(() => import("@/views/Sermons/SermonSeries"));
const Authors = lazy(() => import("@/views/Sermons/SermonAuthors"));
const Scriptures = lazy(() => import("./SermonScriptures"));
const Topics = lazy(() => import("@/views/Sermons/SermonTopics"));

function SermonLanding() {
	return (
	  <div className="flex flex-col h-screen overflow-hidden">
		<header >
			<div className="flex sticky top-0 w-full bg-background pt-2 pb-1 pl-1 border-b-2 dark:shadow-lg dark:shadow-blue-500/50 overflow-hidden z-10">
		  <Nav />
		  </div>
	
		</header>
		
		{/* Main content wrapper */}
		<div className="flex flex-grow overflow-hidden">
		  {/* Sidebar */}
		  <aside className="hidden lg:block bg-background border-r-2 dark:shadow-lg dark:shadow-blue-500/50 lg:p-5">
			<Side />
		  </aside>
		  
		  {/* Main content area */}
		  <main className="flex-grow overflow-hidden h-full p-4">
		  <SearchPage/>
			<Suspense fallback={<div>Loading...</div>}>
			  <Routes>
				<Route path="/" element={<Recent/>} index/>
				<Route path="/sermons" element={<Recent/>} index/>
				<Route path="/sermonlistening/:sermonId" element={<SermonPage />} />
				<Route path="/authors" element={<Authors />} />
				<Route path="/series" element={<Series />} />
				<Route path="/scriptures" element={<Scriptures />} />
				<Route path="/topics" element={<Topics />} />
			  </Routes>
			</Suspense>
		  </main>
		</div>
		
		<footer className="flex fixed bottom-0 w-full bg-background border-t-2 dark:border-none dark:shadow-lg p-2 lg:hidden">
		  <Footer />
		</footer>
	  </div>
	);
  }
  
  export default SermonLanding;