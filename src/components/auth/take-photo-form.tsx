"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

export function TakePhotoForm() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    setIsCameraActive(true);
  }, []);

  const videoConstraints = {
    width: 640,
    height: 640,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    console.log("Capture button clicked - START");
    console.log("Webcam ready:", isWebcamReady);

    if (!webcamRef.current) {
      console.error("Webcam ref is null");
      return;
    }

    if (!isWebcamReady) {
      console.error("Webcam not ready yet");
      return;
    }

    console.log("Webcam ref exists");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(
        "getScreenshot called, result:",
        imageSrc ? "SUCCESS" : "NULL"
      );

      if (imageSrc) {
        console.log("Setting captured image, length:", imageSrc.length);
        setCapturedImage(imageSrc);
        setIsCameraActive(false);
        console.log("Photo captured and state updated!");
      } else {
        console.error("getScreenshot returned null");
      }
    } catch (error) {
      console.error("Exception during capture:", error);
    }
  }, [isWebcamReady]);

  const handlePhotoClick = () => {
    if (capturedImage) {
      setCapturedImage(null);
      setIsCameraActive(true);
    }
  };

  const handleTakeAgain = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
    setIsWebcamReady(false);
  };

  const handleProceed = () => {
    if (capturedImage) {
      router.push("/setup-profile");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-[320px] md:max-w-md lg:max-w-[500px] flex flex-col gap-4 sm:gap-6 md:gap-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text">
            Take Photo
          </h1>
          <p className="text-text-gray text-sm sm:text-base font-normal">
            Capture a clear photo of yourself while holding your identification
            card
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
          <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-square rounded-full flex items-center justify-center bg-transparent">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: "visible" }}
            >
              <circle
                cx="50%"
                cy="50%"
                r="calc(50% - 1px)"
                fill="none"
                stroke="#A4A7AE"
                strokeWidth="2"
                strokeDasharray="6 12"
                strokeLinecap="round"
              />
            </svg>
            {isCameraActive && !capturedImage ? (
              <div className="w-full h-full flex flex-col items-center justify-center rounded-full overflow-hidden">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover rounded-full"
                  onUserMedia={() => {
                    console.log("Camera stream started successfully");
                    setIsWebcamReady(true);
                  }}
                  onUserMediaError={(error) => {
                    console.error("Camera error:", error);
                    setIsWebcamReady(false);
                  }}
                />
                <div className="absolute bottom-3 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Button clicked!");
                      capture();
                    }}
                    className="h-10 w-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors z-10 cursor-pointer"
                    aria-label="Capture photo"
                    disabled={!isWebcamReady}
                  >
                    <Camera className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            ) : capturedImage ? (
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 w-full">
          <Button
            type="button"
            onClick={handleTakeAgain}
            className="flex-1 rounded-[200px]  bg-input-bg text-primary-text font-semibold text-base cursor-pointer hover:bg-dark-border"
            size="default"
          >
            Take Again
          </Button>
          <Button
            type="button"
            onClick={handleProceed}
            className="flex-1 rounded-[200px] text-white font-semibold text-base cursor-pointer"
            size="default"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
