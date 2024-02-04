import Logo from "@/Logos/ChurchLogo/ChurchLogo";
import Nav from "@/views/Sermons/SermonNavbar.tsx";
import Drop from "@/views/Sermons/MenuDropDown.tsx";

function SermonHeader() {
  return (
    <div>
      <div className="sm:hidden block pr-4 right-0">
        <Drop />
      </div>

      <Logo />
      <h1 className="text-center text-3xl">Sermons</h1>
      <div className="sm:block hidden p-4 w-screen">
        <Nav />
      </div>
    </div>
  );
}

export default SermonHeader;
