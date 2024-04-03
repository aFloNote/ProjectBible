
import { Logo } from "@/Logos/SiteLogo";
import {Link} from 'react-router-dom';
import MenuNav from "@/views/sitenav/navmenu";

function TopNav() {
  return (
    <div className="flex justify-between w-full pb-1">
  <div className='w-90 pr-10'></div> {/* This empty div is used to take up space on the left side */}
  <Link to='https://www.faithbiblechurchtreasurevalley.net/'>
  <Logo ratio={16 / 9} size="6em" />
  </Link>
  <div className="flex pr-5">
    <MenuNav />
  </div>
</div>
  );
}

export default TopNav;
