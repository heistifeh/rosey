// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export function ProfileSetupForm() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     about: "",
//     tagline: "",
//     height: "",
//     ethnicityCategory: "",
//     languages: "",
//     eyeColor: "",
//     bodyType: "",
//     hairColor: "",
//     friendly420: "",
//   });

//   const progressSteps = [
//     { number: 1, label: "General Information", isActive: false },
//     { number: 2, label: "Profile Setup", isActive: true },
//     { number: 3, label: "Rates", isActive: false },
//     { number: 4, label: "Availability", isActive: false },
//   ];

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     router.push("/rates");
//   };

//   return (
//     <div className="flex flex-col flex-1 w-full px-4 md:px-0 overflow-y-auto">
//       <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6">
//         <div className="flex flex-col gap-6 md:gap-8">
//           <div className="flex justify-center w-full px-4">
//             <div className="flex gap-2 md:gap-4 px-4 py-2 rounded-[200px] w-full max-w-full overflow-x-auto justify-center">
//               {progressSteps.map((step) => (
//                 <button
//                   key={step.number}
//                   className={`px-3 py-2 sm:px-4 rounded-[200px] border border-primary text-primary-text text-xs sm:text-sm font-medium shrink-0 ${
//                     step.isActive ? "bg-primary" : "bg-tag-bg"
//                   }`}
//                 >
//                   {step.number}. {step.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text  text-center">
//             Profile Setup
//           </h1>

//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col gap-6 md:gap-8"
//           >
//             <div className="flex flex-col gap-2">
//               <Label
//                 htmlFor="about"
//                 className="text-[14px] font-semibold text-[#FCFCFD]"
//               >
//                 About <span className="text-primary">*</span>
//               </Label>
//               <textarea
//                 id="about"
//                 value={formData.about}
//                 onChange={(e) => handleChange("about", e.target.value)}
//                 className="flex min-h-[200px] w-full rounded-lg border border-transparent bg-input-bg px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 resize-y"
//                 rows={8}
//               />
//               <p className="text-[12px] font-normal text-text-gray-opacity">
//                 Write a short bio about yourself. Profiles with at least three
//                 paragraphs get more views. Keep it over 300 characters, and
//                 don't include contact info, stats, or rates. Limit emojis and
//                 ASCII so your profile stays accessible and searchable.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//               <div className="flex flex-col gap-6 sm:gap-10">
//                 <div className="flex flex-col gap-2 md:min-h-[120px]">
//                   <Label
//                     htmlFor="tagline"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Tagline
//                   </Label>
//                   <Input
//                     id="tagline"
//                     type="text"
//                     value={formData.tagline}
//                     onChange={(e) => handleChange("tagline", e.target.value)}
//                   />
//                   <p className="text-[12px] font-normal text-text-gray-opacity">
//                     Use a quick, catchy line to stand out, shown clearly on your
//                     search thumbnail.
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 md:min-h-[120px]">
//                   <Label
//                     htmlFor="ethnicityCategory"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Ethnicity Category
//                   </Label>
//                   <Select
//                     value={formData.ethnicityCategory || undefined}
//                     onValueChange={(value) =>
//                       handleChange("ethnicityCategory", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Asian, Black, White, Hispanic, Latino">
//                         Asian, Black, White, Hispanic, Latino
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-[12px] font-normal text-text-gray-opacity">
//                     This will be displayed on your profile, select to show up in
//                     the relevant categories.
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 md:min-h-[92px]">
//                   <Label
//                     htmlFor="eyeColor"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Eye Color
//                   </Label>
//                   <Select
//                     value={formData.eyeColor || undefined}
//                     onValueChange={(value) => handleChange("eyeColor", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Brown">Brown</SelectItem>
//                       <SelectItem value="Blue">Blue</SelectItem>
//                       <SelectItem value="Green">Green</SelectItem>
//                       <SelectItem value="Hazel">Hazel</SelectItem>
//                       <SelectItem value="Gray">Gray</SelectItem>
//                       <SelectItem value="Amber">Amber</SelectItem>
//                       <SelectItem value="Other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex flex-col gap-2 md:min-h-[92px]">
//                   <Label
//                     htmlFor="hairColor"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Hair Color
//                   </Label>
//                   <Select
//                     value={formData.hairColor || undefined}
//                     onValueChange={(value) => handleChange("hairColor", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Black">Black</SelectItem>
//                       <SelectItem value="Brown">Brown</SelectItem>
//                       <SelectItem value="Blonde">Blonde</SelectItem>
//                       <SelectItem value="Red">Red</SelectItem>
//                       <SelectItem value="Auburn">Auburn</SelectItem>
//                       <SelectItem value="Gray">Gray</SelectItem>
//                       <SelectItem value="White">White</SelectItem>
//                       <SelectItem value="Bald">Bald</SelectItem>
//                       <SelectItem value="Other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-6 sm:gap-10">
//                 <div className="flex flex-col gap-2 md:min-h-[120px]">
//                   <Label
//                     htmlFor="height"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Height
//                   </Label>
//                   <Select
//                     value={formData.height || undefined}
//                     onValueChange={(value) => handleChange("height", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="4'0&quot;">4'0"</SelectItem>
//                       <SelectItem value="4'1&quot;">4'1"</SelectItem>
//                       <SelectItem value="4'2&quot;">4'2"</SelectItem>
//                       <SelectItem value="4'3&quot;">4'3"</SelectItem>
//                       <SelectItem value="4'4&quot;">4'4"</SelectItem>
//                       <SelectItem value="4'5&quot;">4'5"</SelectItem>
//                       <SelectItem value="4'6&quot;">4'6"</SelectItem>
//                       <SelectItem value="4'7&quot;">4'7"</SelectItem>
//                       <SelectItem value="4'8&quot;">4'8"</SelectItem>
//                       <SelectItem value="4'9&quot;">4'9"</SelectItem>
//                       <SelectItem value="4'10&quot;">4'10"</SelectItem>
//                       <SelectItem value="4'11&quot;">4'11"</SelectItem>
//                       <SelectItem value="5'0&quot;">5'0"</SelectItem>
//                       <SelectItem value="5'1&quot;">5'1"</SelectItem>
//                       <SelectItem value="5'2&quot;">5'2"</SelectItem>
//                       <SelectItem value="5'3&quot;">5'3"</SelectItem>
//                       <SelectItem value="5'4&quot;">5'4"</SelectItem>
//                       <SelectItem value="5'5&quot;">5'5"</SelectItem>
//                       <SelectItem value="5'6&quot;">5'6"</SelectItem>
//                       <SelectItem value="5'7&quot;">5'7"</SelectItem>
//                       <SelectItem value="5'8&quot;">5'8"</SelectItem>
//                       <SelectItem value="5'9&quot;">5'9"</SelectItem>
//                       <SelectItem value="5'10&quot;">5'10"</SelectItem>
//                       <SelectItem value="5'11&quot;">5'11"</SelectItem>
//                       <SelectItem value="6'0&quot;">6'0"</SelectItem>
//                       <SelectItem value="6'1&quot;">6'1"</SelectItem>
//                       <SelectItem value="6'2&quot;">6'2"</SelectItem>
//                       <SelectItem value="6'3&quot;">6'3"</SelectItem>
//                       <SelectItem value="6'4&quot;">6'4"</SelectItem>
//                       <SelectItem value="6'5&quot;">6'5"</SelectItem>
//                       <SelectItem value="6'6&quot;">6'6"</SelectItem>
//                       <SelectItem value="6'7&quot;">6'7"</SelectItem>
//                       <SelectItem value="6'8&quot;">6'8"</SelectItem>
//                       <SelectItem value="6'9&quot;">6'9"</SelectItem>
//                       <SelectItem value="6'10&quot;">6'10"</SelectItem>
//                       <SelectItem value="6'11&quot;">6'11"</SelectItem>
//                       <SelectItem value="7'0&quot;">7'0"</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex flex-col gap-2 md:min-h-[120px]">
//                   <Label
//                     htmlFor="languages"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Languages
//                   </Label>
//                   <Select
//                     value={formData.languages || undefined}
//                     onValueChange={(value) => handleChange("languages", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="English">English</SelectItem>
//                       <SelectItem value="Spanish">Spanish</SelectItem>
//                       <SelectItem value="French">French</SelectItem>
//                       <SelectItem value="German">German</SelectItem>
//                       <SelectItem value="Italian">Italian</SelectItem>
//                       <SelectItem value="Portuguese">Portuguese</SelectItem>
//                       <SelectItem value="Russian">Russian</SelectItem>
//                       <SelectItem value="Chinese">Chinese</SelectItem>
//                       <SelectItem value="Japanese">Japanese</SelectItem>
//                       <SelectItem value="Korean">Korean</SelectItem>
//                       <SelectItem value="Arabic">Arabic</SelectItem>
//                       <SelectItem value="Hindi">Hindi</SelectItem>
//                       <SelectItem value="Multiple">Multiple</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-[12px] font-normal text-text-gray-opacity">
//                     Select the languages you speak fluently.
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 md:min-h-[92px]">
//                   <Label
//                     htmlFor="bodyType"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     Body Type
//                   </Label>
//                   <Select
//                     value={formData.bodyType || undefined}
//                     onValueChange={(value) => handleChange("bodyType", value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Slim">Slim</SelectItem>
//                       <SelectItem value="Athletic">Athletic</SelectItem>
//                       <SelectItem value="Average">Average</SelectItem>
//                       <SelectItem value="Curvy">Curvy</SelectItem>
//                       <SelectItem value="Plus Size">Plus Size</SelectItem>
//                       <SelectItem value="Muscular">Muscular</SelectItem>
//                       <SelectItem value="Petite">Petite</SelectItem>
//                       <SelectItem value="Tall">Tall</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-[12px] font-normal text-text-gray-opacity">
//                     If set, your profile will be searchable under this category.
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 md:min-h-[92px]">
//                   <Label
//                     htmlFor="friendly420"
//                     className="text-[14px] font-semibold text-[#FCFCFD]"
//                   >
//                     420-Friendly
//                   </Label>
//                   <Select
//                     value={formData.friendly420 || undefined}
//                     onValueChange={(value) =>
//                       handleChange("friendly420", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Yes">Yes</SelectItem>
//                       <SelectItem value="No">No</SelectItem>
//                       <SelectItem value="Sometimes">Sometimes</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <p className="text-[12px] font-normal text-text-gray-opacity">
//                     If Yes is selected, this will appear on your profile,
//                     categorize you correctly, and make you searchable.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center pt-4">
//               <Button
//                 type="submit"
//                 className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer"
//                 size="default"
//               >
//                 Next
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfileSetupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    about: "",
    tagline: "",
    height: "",
    ethnicityCategory: "",
    languages: "",
    eyeColor: "",
    bodyType: "",
    hairColor: "",
    friendly420: "",
  });

  const progressSteps = [
    { number: 1, label: "General Information", isActive: false },
    { number: 2, label: "Profile Setup", isActive: true },
    { number: 3, label: "Rates", isActive: false },
    { number: 4, label: "Availability", isActive: false },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/rates");
  };

  return (
    <div className="flex flex-col flex-1 w-full px-4 md:px-0 overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 py-6">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex justify-center w-full px-4">
            <div className="flex gap-2 md:gap-4 px-4 py-2 rounded-[200px] w-full max-w-full overflow-x-auto justify-center">
              {progressSteps.map((step) => (
                <button
                  key={step.number}
                  className={`px-3 py-2 sm:px-4 rounded-[200px] border border-primary text-primary-text text-xs sm:text-sm font-medium shrink-0 ${
                    step.isActive ? "bg-primary" : "bg-tag-bg"
                  }`}
                >
                  {step.number}. {step.label}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-[18px] sm:text-4xl font-semibold text-primary-text  text-center">
            Profile Setup
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-8"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="about"
                className="text-[14px] font-semibold text-[#FCFCFD]"
              >
                About <span className="text-primary">*</span>
              </Label>
              <textarea
                id="about"
                value={formData.about}
                onChange={(e) => handleChange("about", e.target.value)}
                className="flex min-h-[200px] w-full rounded-lg border border-transparent bg-input-bg px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                rows={8}
              />
              <p className="text-[12px] font-normal text-text-gray-opacity">
                Write a short bio about yourself. Profiles with at least three
                paragraphs get more views. Keep it over 300 characters, and
                don't include contact info, stats, or rates. Limit emojis and
                ASCII so your profile stays accessible and searchable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col gap-6 sm:gap-10">
                <div className="flex flex-col gap-2 min-h-[120px]">
                  <Label
                    htmlFor="tagline"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Tagline
                  </Label>
                  <Input
                    id="tagline"
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                  />
                  <p className="text-[12px] font-normal text-text-gray-opacity">
                    Use a quick, catchy line to stand out, shown clearly on your
                    search thumbnail.
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-h-[120px]">
                  <Label
                    htmlFor="ethnicityCategory"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Ethnicity Category
                  </Label>
                  <Select
                    value={formData.ethnicityCategory || undefined}
                    onValueChange={(value) =>
                      handleChange("ethnicityCategory", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asian, Black, White, Hispanic, Latino">
                        Asian, Black, White, Hispanic, Latino
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[12px] font-normal text-text-gray-opacity">
                    This will be displayed on your profile, select to show up in
                    the relevant categories.
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-h-[92px]">
                  <Label
                    htmlFor="eyeColor"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Eye Color
                  </Label>
                  <Select
                    value={formData.eyeColor || undefined}
                    onValueChange={(value) => handleChange("eyeColor", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Blue">Blue</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Hazel">Hazel</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                      <SelectItem value="Amber">Amber</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 min-h-[92px]">
                  <Label
                    htmlFor="hairColor"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Hair Color
                  </Label>
                  <Select
                    value={formData.hairColor || undefined}
                    onValueChange={(value) => handleChange("hairColor", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Blonde">Blonde</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Auburn">Auburn</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Bald">Bald</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-6 sm:gap-10">
                <div className="flex flex-col gap-2 min-h-[120px]">
                  <Label
                    htmlFor="height"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Height
                  </Label>
                  <Select
                    value={formData.height || undefined}
                    onValueChange={(value) => handleChange("height", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4'0&quot;">4'0"</SelectItem>
                      <SelectItem value="4'1&quot;">4'1"</SelectItem>
                      <SelectItem value="4'2&quot;">4'2"</SelectItem>
                      <SelectItem value="4'3&quot;">4'3"</SelectItem>
                      <SelectItem value="4'4&quot;">4'4"</SelectItem>
                      <SelectItem value="4'5&quot;">4'5"</SelectItem>
                      <SelectItem value="4'6&quot;">4'6"</SelectItem>
                      <SelectItem value="4'7&quot;">4'7"</SelectItem>
                      <SelectItem value="4'8&quot;">4'8"</SelectItem>
                      <SelectItem value="4'9&quot;">4'9"</SelectItem>
                      <SelectItem value="4'10&quot;">4'10"</SelectItem>
                      <SelectItem value="4'11&quot;">4'11"</SelectItem>
                      <SelectItem value="5'0&quot;">5'0"</SelectItem>
                      <SelectItem value="5'1&quot;">5'1"</SelectItem>
                      <SelectItem value="5'2&quot;">5'2"</SelectItem>
                      <SelectItem value="5'3&quot;">5'3"</SelectItem>
                      <SelectItem value="5'4&quot;">5'4"</SelectItem>
                      <SelectItem value="5'5&quot;">5'5"</SelectItem>
                      <SelectItem value="5'6&quot;">5'6"</SelectItem>
                      <SelectItem value="5'7&quot;">5'7"</SelectItem>
                      <SelectItem value="5'8&quot;">5'8"</SelectItem>
                      <SelectItem value="5'9&quot;">5'9"</SelectItem>
                      <SelectItem value="5'10&quot;">5'10"</SelectItem>
                      <SelectItem value="5'11&quot;">5'11"</SelectItem>
                      <SelectItem value="6'0&quot;">6'0"</SelectItem>
                      <SelectItem value="6'1&quot;">6'1"</SelectItem>
                      <SelectItem value="6'2&quot;">6'2"</SelectItem>
                      <SelectItem value="6'3&quot;">6'3"</SelectItem>
                      <SelectItem value="6'4&quot;">6'4"</SelectItem>
                      <SelectItem value="6'5&quot;">6'5"</SelectItem>
                      <SelectItem value="6'6&quot;">6'6"</SelectItem>
                      <SelectItem value="6'7&quot;">6'7"</SelectItem>
                      <SelectItem value="6'8&quot;">6'8"</SelectItem>
                      <SelectItem value="6'9&quot;">6'9"</SelectItem>
                      <SelectItem value="6'10&quot;">6'10"</SelectItem>
                      <SelectItem value="6'11&quot;">6'11"</SelectItem>
                      <SelectItem value="7'0&quot;">7'0"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2 min-h-[120px]">
                  <Label
                    htmlFor="languages"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Languages
                  </Label>
                  <Select
                    value={formData.languages || undefined}
                    onValueChange={(value) => handleChange("languages", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="Russian">Russian</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[12px] font-normal text-text-gray-opacity">
                    Select the languages you speak fluently.
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-h-[92px]">
                  <Label
                    htmlFor="bodyType"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    Body Type
                  </Label>
                  <Select
                    value={formData.bodyType || undefined}
                    onValueChange={(value) => handleChange("bodyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Slim">Slim</SelectItem>
                      <SelectItem value="Athletic">Athletic</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Curvy">Curvy</SelectItem>
                      <SelectItem value="Plus Size">Plus Size</SelectItem>
                      <SelectItem value="Muscular">Muscular</SelectItem>
                      <SelectItem value="Petite">Petite</SelectItem>
                      <SelectItem value="Tall">Tall</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[12px] font-normal text-text-gray-opacity">
                    If set, your profile will be searchable under this category.
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-h-[92px]">
                  <Label
                    htmlFor="friendly420"
                    className="text-[14px] font-semibold text-[#FCFCFD]"
                  >
                    420-Friendly
                  </Label>
                  <Select
                    value={formData.friendly420 || undefined}
                    onValueChange={(value) =>
                      handleChange("friendly420", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Sometimes">Sometimes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[12px] font-normal text-text-gray-opacity">
                    If Yes is selected, this will appear on your profile,
                    categorize you correctly, and make you searchable.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-full max-w-[628px] px-8 py-3 rounded-[200px] bg-primary text-white font-semibold text-base cursor-pointer"
                size="default"
              >
                Next
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
