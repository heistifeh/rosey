export type CreditPackageId = "starter" | "popular" | "pro";

export const CREDIT_PACKAGES = {
  starter: {
    credits: 500,
    amount: 10,
    currency: "EUR",
    description: "500 credits",
  },
  popular: {
    credits: 1200,
    amount: 20,
    currency: "EUR",
    description: "1200 credits",
  },
  pro: {
    credits: 3500,
    amount: 50,
    currency: "EUR",
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
