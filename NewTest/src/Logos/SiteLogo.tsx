
import { useTheme } from "@/components/theme-provider";
import { AspectRatio } from '@/components/ui/aspect-ratio';
interface LogoProps {
    ratio: number;
    size: string;
}
export function Logo({ ratio, size }: LogoProps) {
    const { theme } = useTheme();
	const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const logo = isDark ? b2endpoint+'logos/FBC_TV_Logo_White.png': b2endpoint+'logos/FBC_TV_Logo.png';
    console.log(size)
    return (
        <div className='w-28 lg:w-40'>
            <AspectRatio ratio={ratio}>
                <img src={logo} alt="Logo" className="rounded-md object-cover" style={{ width: '100%', height: '100%' }} />
            </AspectRatio>
        </div>
    );
}

