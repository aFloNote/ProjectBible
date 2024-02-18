import logoLight from '@/assets/FBC_TV_Logo.png';
import logoDark from '@/assets/FBC_TV_Logo_White.png';
import { useTheme } from "@/components/theme-provider";
import { AspectRatio } from '@/components/ui/aspect-ratio';
// If you're using a specific Image component (like from Next.js), import it:
// import Image from 'next/image';
// Or for standard HTML img, no import is needed.

function Logo() {
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const logo = isDark ? logoDark : logoLight;
    
    return (
        <div className="w-[4em]">
            {/* Assuming AspectRatio is a custom or library component that you've imported */}
            <AspectRatio ratio={16 / 9}>
                {/* Ensure you're using the correct Image component or <img> tag here */}
                <img src={logo} alt="Logo" className="rounded-md object-cover" />
            </AspectRatio>
        </div>
    );
}

export default Logo;