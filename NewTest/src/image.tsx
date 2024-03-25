


import { AspectRatio } from '@/components/ui/aspect-ratio';
interface ImageProps {
    ratio: number;
    source: string;
    divClass:string;
    alt:string
    
}
export function SiteImage({source,ratio,divClass,alt}: ImageProps) {
  
  
    return (
        <div className={divClass}> {/* Ensure it's responsive and centered */}
        <AspectRatio ratio={ratio} className="w-full"> {/* Maintain aspect ratio */}
            <img
                src={source}
                alt={alt}
                className="h-full w-full max-w-64 max-h-48 mx-auto rounded-md object-cover"
            />
        </AspectRatio>
    </div>
    );
}

