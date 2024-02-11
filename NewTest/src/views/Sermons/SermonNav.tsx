import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { useTheme } from "@/components/theme-provider";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen} from "react-icons/fa";
import React from "react";

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
  const { theme } = useTheme();

  const iconSize = 20;

  return (
    <div>
      <NavigationMenu className="sm:hidden block">
        <NavigationMenuList
          className={`NavigationMenuList ${theme} text-center fixed bottom-0 inset-x-0 pt-2 flex justify-between`}
        >
          {NAV_ITEMS.map((item, index) => (
            <React.Fragment key={index}>
              <NavigationMenuItem className="flex-1">
                <NavigationMenuLink
                  href={item.href}
                  className={`${navigationMenuTriggerStyle()} flex flex-col items-center justify-center`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <item.icon size={iconSize} />
                    <span className="text-xs text-center font-normal">
                      {item.desc}
                    </span>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </React.Fragment>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default SermonNav;
