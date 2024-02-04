import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/mode-toogle";
import { useTheme } from "@/components/theme-provider";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import { FaLayerGroup, FaBookOpen, FaSearch } from "react-icons/fa";
import '@/views/Sermons/SermonNavBar.css';
import React from "react";

const NAV_ITEMS = [
  { href: 'https://github.com/radix-ui', label: 'Recent', icon: MdUpdate, className: 'sm:block hidden' },
  { href: 'https://github.com/radix-ui', label: 'Menu', icon: FaBookOpen, className: 'sm:block hidden' },
  { href: 'https://github.com/radix-ui', label: 'Series', icon: FaLayerGroup, className: 'sm:block hidden' },
  { href: 'https://github.com/radix-ui', label: 'Author', icon: IoPersonCircleOutline, className: 'sm:block hidden' },
  { href: 'https://github.com/radix-ui', label: 'Search', icon: FaSearch, className: 'sm:block hidden' },
];

function NavBar() {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const themeClass = isDark ? "dark" : "light";
  const iconSize = 20;

  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList className={`NavigationMenuList ${themeClass}`}>
          {NAV_ITEMS.map((item, index) => (
            <React.Fragment key={index}>
              <NavigationMenuItem className={item.className}>
                <NavigationMenuLink href={item.href} className={`${navigationMenuTriggerStyle()}`}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="sm:hidden block">
                <NavigationMenuLink href={item.href} className={`${navigationMenuTriggerStyle()}`}>
                  <item.icon size={iconSize} />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </React.Fragment>
          ))}
          <NavigationMenuItem>
            <ModeToggle/>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default NavBar;
