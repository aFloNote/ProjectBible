import Logo from "@/Logos/ChurchLogo/ChurchLogo";
import Nav from "@/views/Sermons/SermonNavbar.tsx";
import TopNav from "@/views/TopBar.tsx";

function SermonHeader() {
  return (
    <div>
      <div className='w-screen fixed top-0'>
        <TopNav />
      </div>
       <div className='pt-10'>
      <Logo />
      </div>
      <h1 className="text-center text-3xl">Sermons</h1>
      <div className="sm:block hidden p-4 w-screen">
        <Nav />
      </div>
    </div>
  );
}

export default SermonHeader;
