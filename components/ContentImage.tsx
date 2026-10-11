import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
};

export function ContentImage({ src, alt, className, priority = false, fill = false,
  width = 1200, height = 800,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" }: Props) {
  // Existing externally hosted photos remain supported without an open optimizer proxy.
  const optimizable = src.startsWith("/") && !src.startsWith("//") ||
    /^https:\/\/res\.cloudinary\.com\//.test(src);
  return <Image src={src} alt={alt} className={className} fill={fill}
    width={fill ? undefined : width} height={fill ? undefined : height}
    sizes={sizes} priority={priority} unoptimized={!optimizable} />;
}
