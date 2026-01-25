"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

type SafeImageProps = ImageProps & {
  fallbackSrc?: ImageProps["src"];
};

export function SafeImage({
  fallbackSrc = "/images/girl1.png",
  src,
  alt,
  onError,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<ImageProps["src"]>(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
