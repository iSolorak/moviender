import Image from "next/image";

import { FALLBACK_POSTER } from "@/lib/constants";

type MoviePosterProps = {
  src?: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function MoviePoster({ src, alt, priority, className = "" }: MoviePosterProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-slate-900 ${className}`}>
      <Image
        src={src ?? FALLBACK_POSTER}
        alt={alt}
        fill
        sizes="(max-width: 768px) 92vw, (max-width: 1280px) 22rem, 22rem"
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/18 to-transparent" />
    </div>
  );
}
