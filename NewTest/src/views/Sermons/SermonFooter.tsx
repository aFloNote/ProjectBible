''

import Nav from "@/views/Sermons/SermonNavbar.tsx";


function SermonFooter() {

  return (
    <div
     className='w-screen'
    >
       <div className='sm:hidden block fixed bottom-0 w-screen'>
      <Nav />
      </div>
      
    </div>
  );
}

export default SermonFooter
