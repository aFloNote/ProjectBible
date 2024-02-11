
import Main from '@/views/Sermons/SermonContent';
import Footer from '@/views/Sermons/SermonNav';
import Header from '@/views/sitenav/TopNav';
import { useAuth0 } from "@auth0/auth0-react";
function SermonLanding() {
  const { loginWithRedirect } = useAuth0();
  return (
    <>
    <button onClick={() => loginWithRedirect()}>Log In</button>
    <Header />
      <Main />
      
      <Footer />
       
    </>
  );
}
export default SermonLanding;