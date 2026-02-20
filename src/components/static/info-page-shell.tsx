import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";

type InfoPageShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function InfoPageShell({ title, subtitle, children }: InfoPageShellProps) {
  return (
    <section className="flex min-h-screen flex-col bg-input-bg">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 pt-10 md:px-[60px] md:pb-24 md:pt-16">
        <div className="rounded-3xl border border-dark-border bg-primary-bg/80 p-5 md:p-8">
          <h1 className="text-2xl font-semibold text-primary-text md:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-sm text-text-gray-opacity md:text-base">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-8 space-y-8 text-sm leading-7 text-text-gray md:text-base">
            {children}
          </div>
        </div>
      </main>

      <FooterSection hideLocationsSection />
    </section>
  );
}
