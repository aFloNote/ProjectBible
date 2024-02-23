
import Main from '@/views/Sermons/SermonContent';
import Footer from '@/views/Sermons/SermonNav';
import Nav from '@/views/sitenav/TopNav';

function SermonLanding() {

  return (
  
    
    <>
      <div className="container">
        <div className="flex sticky top-0  pt-2 pb-1 pl-1 bg-background shadow-lg dark:shadow-blue-500/50">
          <Nav />
        </div>
        <div className="container px-4">
        

     
            <Main />
          
       
        </div>
        <div className="flex sticky bottom-0 pt-2 pb-1 pl-1 bg-background shadow-lg dark:shadow-blue-500/50 sm:hidden block">
        <Footer />
        </div>
      </div>
    </>
  );
}
export default SermonLanding; 
<>

</>