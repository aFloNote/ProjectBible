import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen } from "react-icons/fa";

import "@/Styles/SermonNav.css";

const NAV_ITEMS = [
  {
    href: "https://github.com/radix-ui",

    icon: MdUpdate,
    desc: "Recent",
  },
  {
    href: "https://github.com/radix-ui",

    icon: FaBookOpen,

    desc: "Scripture",
  },
  {
    href: "https://github.com/radix-ui",

    icon: FaLayerGroup,

    desc: "Series",
  },
  {
    href: "https://github.com/radix-ui",

    icon: IoPersonCircleOutline,

    desc: "Speaker",
  },
];

function SermonNav() {
  const iconSize = 30;

  return (
    <div className="flex justify-full w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
          <div className="flex flex-col items-center justify-center">
            <FaBookOpen size={iconSize} />
            <span className="text-xs text-center font-normal">Scriptures</span>
          </div>
          </NavigationMenuItem>

          <NavigationMenuItem>
          <div className="flex flex-col items-center justify-center">
            <MdUpdate size={iconSize} />
            <span className="text-xs text-center font-normal">Recent</span>
          </div>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <div className="flex flex-col items-center justify-center">
            <FaLayerGroup size={iconSize} />
            <span className="text-xs text-center font-normal">Series</span>
          </div>
          </NavigationMenuItem>
          <div className="flex flex-col items-center justify-center">
            <IoPersonCircleOutline size={iconSize} />
            <span className="text-xs text-center font-normal">Authors</span>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex justify-end">
        <div className="pt-2 pr-1"></div>
      </div>
    </div>
  );
}

export default SermonNav;
