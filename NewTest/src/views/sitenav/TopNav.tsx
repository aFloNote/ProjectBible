import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/Logos/SiteLogo";
import ErrorBoundary from "@/components/error";

import Search from "@/components/search";
import MenuNav from "@/views/sitenav/navmenu";

function TopNav() {
  return (
    <div className="flex columns-3 justify-between w-full">
      <Logo ratio={16 / 9} size="6em" />

      <div className="pt-5 pr-2 pt-3 lg:pt-6 "></div>
      <div className="flex justify-end">
        <div className="pt-2 pr-1 pt-3 lg:pt-7 ">
          <MenuNav />
        </div>
        <div className="pt-2">
          <div className="border-r-2 border-gray-500/50 h-10 lg:h-16" />
        </div>
        <div className="pt-2 pr-2 pl-2 pt-3 lg:pt-6">
          <ErrorBoundary>
            <Search />
          </ErrorBoundary>
        </div>
        <div className="pt-2">
          <div className="border-r-2 border-gray-500/50 h-10 lg:h-16" />
        </div>
        <div className="pt-2 pr-2 lg:pt-6 lg:pr-10">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default TopNav;
