

import {
    NavigationMenu,
  
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
   
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu"
  import { ModeToggle } from '@/components/mode-toogle'
  import "@/Sermons/SermonHeaderStyle.css"
  import { useTheme } from "@/components/theme-provider"
  import Logo from "@/Logos/ChurchLogo/ChurchLogo"

function SermonHeader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const themeClass = isDark ? 'dark' : 'light';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo />
          <h1 className="header">Sermons</h1>
      <NavigationMenu >
        <NavigationMenuList className={`NavigationMenuList ${themeClass}`}>
          <NavigationMenuItem>
           <NavigationMenuLink 
            href="https://github.com/radix-ui" className={`${navigationMenuTriggerStyle()}`}>
            Recent
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
           <NavigationMenuLink 
            href="https://github.com/radix-ui" className={`${navigationMenuTriggerStyle()}`}>
            Series
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
           <NavigationMenuLink 
            href="https://github.com/radix-ui" className={`${navigationMenuTriggerStyle()}`}>
            Author
          </NavigationMenuLink>
        </NavigationMenuItem>
          <NavigationMenuItem>
           <NavigationMenuLink 
            href="https://github.com/radix-ui" className={`${navigationMenuTriggerStyle()}`}>
            Search
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ModeToggle />
        </NavigationMenuItem>
        </NavigationMenuList>
        
      </NavigationMenu>
      </div>
        
  );
}

export default SermonHeader;