"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailConfirmationModal } from "@/components/modals/email-confirmation-modal";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SetupAccountForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    workingName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVerify = () => {
    setIsModalOpen(false);
    router.push("/verify-identity");
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <EmailConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onVerify={handleVerify}
      />
      <div className="w-full min-h-screen bg-primary-bg flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col px-4 md:px-[80px] lg:gap-[97px]">
          <div className="pt-6 lg:pt-[60px] mb-10 lg:mb-0">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Discover Escort"
                width={150}
                height={40}
                className="h-auto"
                priority
              />
            </Link>
          </div>

          <div className="lg:hidden mb-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">
                Welcome to{" "}
                <span className="text-primary petemoss text-[40px]">
                  Discover Escorts
                </span>
              </h2>
              <p className="text-text-gray text-sm font-normal">
                A platform for adults providing companionship and paid intimate
                services, created by those who understand the work. Gain
                control, visibility, and a safe space to reach clients.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 pb-10">
            <div className="hidden lg:flex flex-col gap-2 items-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary-text">
                Set Up Your Account
              </h1>
              <p className="text-text-gray text-sm sm:text-base font-normal mb-8 ">
                Enter your details to set up your profile
              </p>
            </div>

            <form
              className="flex flex-col gap-1 sm:gap-6"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col sm:gap-6 gap-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="workingName"
                    className="text-base font-normal text-primary-text"
                  >
                    Working Name
                  </Label>
                  <Input
                    id="workingName"
                    type="text"
                    value={formData.workingName}
                    onChange={(e) =>
                      handleChange("workingName", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    className="text-base font-normal text-primary-text"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="password"
                    className="text-base font-normal text-primary-text"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-base font-normal text-primary-text"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2  ">
                <Checkbox
                  id="agreement"
                  checked={formData.agreed}
                  onChange={(e) => handleChange("agreed", e.target.checked)}
                  className="mt-1 bg-transparent"
                  required
                />
                <Label
                  htmlFor="agreement"
                  className="text-base sm:text-sm text-primary-text font-normal cursor-pointer pb-6 sm:pb-0 "
                >
                  I agree to the platform policies and that I am over the age of
                  18 and the age of majority in my jurisdiction.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-[200px] text-white font-semibold text-base"
                size="default"
              >
                Next
              </Button>
            </form>

            <div className="text-center lg:hidden">
              <Link
                href="/signup/client"
                className="text-primary font-medium text-sm"
              >
                <span className="underline">Sign Up</span>{" "}
                <span className="text-white">as a Client</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="hidden lg:flex lg:w-1/2 relative bg-cover bg-no-repeat bg-position-[center_top]"
          style={{ backgroundImage: "url('/images/setup-bg.png')" }}
        >
          <div className="absolute inset-0 flex items-end  px-[52px] pb-[87px]">
            <div className="flex flex-col gap-6 max-w-md">
              <div className="flex flex-col gap-4">
                {/* <article className=" flex items-center ">
                <h2 className="text-2xl xl:text-4xl font-semibold text-white">
                  Welcome to{" "}
                  <span className="text-primary petemoss text-[60px] font-normal">
                {" "}  Discover Escorts
                </span>
                </h2>
                <span className="text-primary petemoss text-[60px] font-normal">
                  Discover Escorts
                </span>
              </article> */}
                <h2 className="text-2xl xl:text-4xl font-semibold text-white">
                  Welcome to{" "}
                  <span className="text-primary petemoss text-[50px] font-normal">
                    {" "}
                    Discover Escorts
                  </span>
                </h2>
                <p className="text-white text-base xl:text-lg font-normal leading-relaxed">
                  A platform for adults providing companionship and paid
                  intimate services, created by those who understand the work.
                  Gain control, visibility, and a safe space to reach clients.
                </p>
              </div>
              <Button
                type="button"
                className="w-full sm:w-auto px-8 rounded-[200px] text-white font-semibold text-base"
                size="default"
              >
                Sign Up as a Client
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
