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
  import { FaLayerGroup, FaBookOpen, FaSearch } from "react-icons/fa";
  import "@/views/Sermons/SermonNavBar.css";
  import React from "react";
  
  const NAV_ITEMS = [
    {
      href: "https://github.com/radix-ui",
      label: "Recent",
      icon: MdUpdate,
      className: "sm:block hidden",
      desc: "Recent",
    },
    {
      href: "https://github.com/radix-ui",
      label: "Menu",
      icon: FaBookOpen,
      className: "sm:block hidden",
      desc: "Scripture",
    },
    {
      href: "https://github.com/radix-ui",
      label: "Series",
      icon: FaLayerGroup,
      className: "sm:block hidden",
      desc: "Series",
    },
    {
      href: "https://github.com/radix-ui",
      label: "Author",
      icon: IoPersonCircleOutline,
      className: "sm:block hidden",
      desc: "Speaker",
    },
    {
      href: "https://github.com/radix-ui",
      label: "Search",
      icon: FaSearch,
      className: "sm:block hidden",
      desc: "Recent",
    },
  ];
  
  function TopBar() {
    const { theme } = useTheme();
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const themeClass = isDark ? "dark" : "light";
    const iconSize = 20;
  
    return (
      <div>
        <NavigationMenu>
          <NavigationMenuList className={`NavigationMenuList ${themeClass} pt-1`}>
            {NAV_ITEMS.map((item, index) => (
              <React.Fragment key={index}>
                <NavigationMenuItem className={item.className}>
                  <NavigationMenuLink
                    href={item.href}
                    className={`${navigationMenuTriggerStyle()}`}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="sm:hidden block">
                  <NavigationMenuLink
                    href={item.href}
                    className={`${navigationMenuTriggerStyle()}`}
                  >
                    <div className="flex flex-col items-center">
                      <item.icon size={iconSize} />
                      <span className="text-xs font-normal">{item.desc}</span>
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
  
  export default TopBar
  