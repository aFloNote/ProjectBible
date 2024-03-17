import logoLight from '@/assets/FBC_TV_Logo.png';
import logoDark from '@/assets/FBC_TV_Logo_White.png';

import { useTheme } from "@/components/theme-provider";
import { AspectRatio } from '@/components/ui/aspect-ratio';
interface LogoProps {
    ratio: number;
    size: string;
}
export function Logo({ ratio, size }: LogoProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const logo = isDark ? logoDark : logoLight;
    
    return (
        <div className='w-28 lg:w-40'>
            <AspectRatio ratio={ratio}>
                <img src={logo} alt="Logo" className="rounded-md object-cover" style={{ width: '100%', height: '100%' }} />
            </AspectRatio>
        </div>
    );
}

