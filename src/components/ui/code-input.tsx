"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CodeInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  className?: string;
}

export function CodeInput({
  length = 6,
  onComplete,
  className,
}: CodeInputProps) {
  const [code, setCode] = React.useState<string[]>(Array(length).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "") && onComplete) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length);
    setCode(newCode);

    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (newCode.every((digit) => digit !== "") && onComplete) {
      onComplete(newCode.join(""));
    }
  };

  return (
    <div
      className={cn(
        "flex gap-1.5 sm:gap-2 md:gap-3 justify-center px-4 sm:px-0 w-full",
        className
      )}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "w-[48px] sm:w-[76px] h-[80px] sm:h-[100px] rounded-lg bg-input-bg text-center text-xl sm:text-2xl font-semibold text-primary-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            className
          )}
        />
      ))}
    </div>
  );
}
