


import { AspectRatio } from '@/components/ui/aspect-ratio';
interface ImageProps {
    ratio: number;
    size: string;
    source: string;
    className: string;
}
export function Image({ ratio, size, source,className}: ImageProps) {
  
  
    return (
        <div style={{ width: size }}>
            <AspectRatio ratio={ratio}>
                <img src={source} alt="Logo" className={className} style={{ width: '100%', height: '100%' }} />
            </AspectRatio>
        </div>
    );
}

