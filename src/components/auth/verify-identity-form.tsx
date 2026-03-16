"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Shield, FileText, Camera, CheckCircle2 } from "lucide-react";

export function VerifyIdentityForm() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/upload-id");
  };

  const handleSkipVerification = () => {
    router.push("/general-information?tab=general");
  };

  const verificationSteps = [
    {
      icon: FileText,
      title: "Upload Your ID",
      description: "Take a clear photo of your government-issued ID card",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Camera,
      title: "Take a Selfie",
      description: "Capture a photo of yourself holding your ID card",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: CheckCircle2,
      title: "Get Verified",
      description: "We'll review and verify your identity within 24 hours",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-8">
      <div className="w-full max-w-[320px] md:max-w-2xl lg:max-w-4xl flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary-text">
            Verify Your Identity
          </h1>
          <p className="text-text-gray text-sm sm:text-base font-normal max-w-2xl">
            To ensure the safety and security of our platform, we require all
            escorts to verify their identity. This process is quick, secure, and
            completely confidential.
          </p>
        </div>

        {/* Why Verification Badge */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-primary-text font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">
                Why do we verify?
              </h3>
              <p className="text-text-gray text-xs sm:text-sm leading-relaxed">
                Identity verification helps us maintain a safe, trusted
                community. It protects both escorts and clients, prevents fraud,
                and ensures everyone on the platform is who they say they are.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary-text text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative bg-input-bg border border-border-gray rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-all"
                >
                  {/* Step Number */}
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${step.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${step.color}`} />
                    </div>
                    <div>
                      <h3 className="text-primary-text font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">
                        {step.title}
                      </h3>
                      <p className="text-text-gray text-xs sm:text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-input-bg border border-border-gray rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="text-primary-text font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Your Privacy & Security
          </h3>
          <ul className="space-y-2 sm:space-y-3 text-text-gray text-xs sm:text-sm">
            <li className="flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" />
              <span>All documents are encrypted and stored securely</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" />
              <span>
                Your personal information is never shared with third parties
              </span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" />
              <span>Verification is reviewed by our secure team only</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5" />
              <span>You can delete your data at any time</span>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <Button
            type="button"
            onClick={handleGetStarted}
            className="w-full rounded-[200px] text-white font-semibold text-sm sm:text-base h-11 sm:h-12 lg:h-14"
            size="default"
          >
            Get Started
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleSkipVerification}
            className="w-full rounded-[200px] border-border-gray bg-transparent text-primary-text font-semibold text-sm sm:text-base h-11 sm:h-12 lg:h-14 hover:bg-input-bg"
          >
            Post Your Ads without Verification
          </Button>
          <p className="text-text-gray text-xs text-center">
            By continuing, you agree to our verification process and privacy
            policy
          </p>
        </div>
      </div>
    </div>
  );
}
