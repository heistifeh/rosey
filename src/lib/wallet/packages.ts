export type CreditPackageId = "starter" | "medium" | "pro";

export const CREDIT_PACKAGES = {
  starter: {
    credits: 500,
    amount: 1,
    currency: "USD",
    description: "500 credits",
  },
  medium: {
    credits: 1200,
    amount: 250,
    currency: "USD",
    description: "1200 credits",
  },
  pro: {
    credits: 3500,
    amount: 500,
    currency: "USD",
    description: "3500 credits",
  },
} as const;

export function isValidPackageId(value: unknown): value is CreditPackageId {
  return typeof value === "string" && value in CREDIT_PACKAGES;
}

export function getCreditPackage(packageId: string) {
  if (!isValidPackageId(packageId)) {
    return null;
  }

  // Never trust client-provided amounts or credits. Server is source of truth.
  const pkg = CREDIT_PACKAGES[packageId];
  return {
    credits: pkg.credits,
    amount: pkg.amount,
    currency: pkg.currency,
    description: pkg.description,
  };
}
