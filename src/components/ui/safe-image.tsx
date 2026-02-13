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
  unoptimized,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<ImageProps["src"]>(src);
  const isRemote =
    typeof currentSrc === "string" && currentSrc.startsWith("http");
  const shouldUnoptimize = unoptimized ?? isRemote;

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      unoptimized={shouldUnoptimize}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
