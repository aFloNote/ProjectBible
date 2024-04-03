import {
	NavigationMenu,
	NavigationMenuContent,

	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,

	navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";
  import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
  import {Separator} from "@/components/ui/separator";
import { useState } from "react";
  import { GiHamburgerMenu } from "react-icons/gi";
  import  ModeToggle  from "@/components/mode-toggle";






  function Menu() {
	return (
	
		 
	  <NavigationMenu orientation='vertical'>
		<NavigationMenuList className="flex flex-col">
		  <NavigationMenuItem>
			<NavigationMenuLink
			  href="https://www.faithbiblechurchtreasurevalley.net"
			  className={navigationMenuTriggerStyle()}
			>
			  Home
			</NavigationMenuLink>
		  </NavigationMenuItem>
		  <NavigationMenuItem>
			<NavigationMenuTrigger>About</NavigationMenuTrigger>
			<NavigationMenuContent className='text-primary'>
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/about"
				className={navigationMenuTriggerStyle()}
			  >
				About Us
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/leadership"
				className={navigationMenuTriggerStyle()}
			  >
				Leadership
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/what-we-believe"
				className={navigationMenuTriggerStyle()}
			  >
				What We Believe
			  </NavigationMenuLink>
			</NavigationMenuContent>
		  </NavigationMenuItem>
		  <NavigationMenuItem className="relative">
			<NavigationMenuTrigger className="relative">
			  Ministries
			</NavigationMenuTrigger>
			<NavigationMenuContent className='text-primary'>
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/mensministry"
				className={navigationMenuTriggerStyle()}
			  >
				Men
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/women"
				className={navigationMenuTriggerStyle()}
			  >
				Women
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/children"
				className={navigationMenuTriggerStyle()}
			  >
				Children
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/community-group"
				className={navigationMenuTriggerStyle()}
			  >
				Community Group
			  </NavigationMenuLink>
			</NavigationMenuContent>
		  </NavigationMenuItem>
		  <NavigationMenuItem>
			<NavigationMenuTrigger>
			  Connect
			</NavigationMenuTrigger>
			<NavigationMenuContent className='text-primary'>
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/get-involved"
				className={navigationMenuTriggerStyle()}
			  >
				Get Involved
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/events"
				className={navigationMenuTriggerStyle()}
			  >
				Events
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/membership"
				className={navigationMenuTriggerStyle()}
			  >
				Membership
			  </NavigationMenuLink>
			  <Separator className='bg-secondary'orientation="horizontal" />
			  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/contact"
				className={navigationMenuTriggerStyle()}
			  >
				Contact
			  </NavigationMenuLink>
			
			</NavigationMenuContent>
			
		  </NavigationMenuItem>
		  <NavigationMenuLink
				href="https://www.faithbiblechurchtreasurevalley.net/give"
				className={navigationMenuTriggerStyle()}
			  >
				Give
			  </NavigationMenuLink>
		</NavigationMenuList>
	  </NavigationMenu>
	);
  }
  
  export default function MenuNav(){
	const [isClicked, setIsClicked] = useState(false);
	console.log(isClicked)
	return (
		<Popover open={isClicked} onOpenChange={setIsClicked} >
		<PopoverTrigger > <GiHamburgerMenu
	
			  className={isClicked ? 'rotate-90 text-secondary' : ''}
			  size={30}
			/></PopoverTrigger>
		<PopoverContent onOpenAutoFocus={(event) => event.preventDefault()} className='w-fit -translate-x-1'>
			<Menu/>
			<div className='border-t-2'></div>
			<div className="flex justify-center">
			
      
		
		<ModeToggle setIsClicked={setIsClicked} />
         
        
     
    
      
		</div>
       
			</PopoverContent>
	  </Popover>


	);
  }