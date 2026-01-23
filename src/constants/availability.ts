"use client";

export const TIME_SLOT_OPTIONS = [
  { label: "All day", detail: "All Day" },
  { label: "Early morning", detail: "Midnight - 7am" },
  { label: "Morning", detail: "7am - Midday" },
  { label: "Afternoon", detail: "Midday - 5pm" },
  { label: "Evening", detail: "5pm - Midnight" },
];

export const getTimeSlotDetail = (label: string) => {
  if (!label) return label;
  const normalized = label.trim().toLowerCase();
  const match = TIME_SLOT_OPTIONS.find(
    (slot) => slot.label.toLowerCase() === normalized
  );
  return match ? match.detail : label;
};
