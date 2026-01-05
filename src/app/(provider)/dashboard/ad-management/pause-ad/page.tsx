"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cityOptions = [
  "Birmingham",
  "Montgomery",
  "Mobile",
  "Huntsville",
  "Tuscaloosa",
  "Auburn",
  "Hoover",
  "Dothan",
  "Decatur",
  "Madison",
  "Florence",
];

const stateOptions = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function PauseAdPage() {
  return (
    <div className="min-h-screen bg-primary-bg px-4 pt-12 text-white md:px-[60px] md:pt-20">
      <div className="mx-auto w-full max-w-5xl pb-10 pt-10 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary-text md:text-[36px]">
            Choose Where Your Ad Appears
          </h1>
          <p className="mt-2 text-sm text-primary-text md:mt-3 md:text-base">
            Each city costs 15 credits. Add more cities to increase your reach.
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 md:mt-10 md:flex-row md:gap-24">
          <div className="w-full rounded-2xl border border-dark-border bg-tag-bg px-4 py-4 text-center text-sm text-primary-text md:w-auto md:rounded-full md:py-2 md:text-base">
            <span className="block md:inline">Cities Selected: 1</span>
            <span className="hidden md:inline">
              &nbsp;&nbsp;&middot;&nbsp;&nbsp;Credit Used: 40&nbsp;&nbsp;&middot;&nbsp;&nbsp;Available Credit: 209
            </span>
            <span className="mt-2 block md:hidden">Credit Used: 40</span>
            <span className="mt-1 block md:hidden">Available Credit: 209</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-primary-text md:text-base">
            <span>Select All</span>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-dark-border bg-primary-bg text-primary"
            />
          </label>
        </div>
        <div className="mt-6 pr-0 md:pr-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stateOptions.map((state) => (
              <Select key={state}>
                <SelectTrigger className="h-12 rounded-[12px] border border-dark-border bg-input-bg px-4 py-3 text-sm text-primary-text focus:ring-1 focus:ring-primary md:h-auto md:rounded-[10px]">
                  <SelectValue placeholder={state} />
                </SelectTrigger>
                <SelectContent className="border-dark-border bg-input-bg p-0">
                  <div className="px-4 py-3">
                    <ul className="space-y-4 text-sm text-text-gray-opacity md:text-base">
                      {cityOptions.map((city) => (
                        <li
                          key={`${state}-${city}`}
                          className="flex items-center justify-between gap-4"
                        >
                          <span>{city}</span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-dark-border bg-primary-bg text-primary"
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between gap-4 text-sm font-semibold text-primary-text md:text-base">
                      <span>Select all cities in {state} (200 Credits)</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-dark-border bg-primary-bg text-primary"
                      />
                    </div>
                  </div>
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-primary-bg text-text-gray-opacity"
            aria-label="Back"
          >
            <span className="text-lg">‹</span>
          </button>
          <Button type="button" className="w-full max-w-md">
            Place Ad
          </Button>
        </div>
      </div>
    </div>
  );
}
