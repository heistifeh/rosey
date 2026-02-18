import { Header } from "@/components/layout/header";
import { FooterSection } from "@/components/home/footer-section";
import { LocationDirectory } from "@/components/location/location-directory";

export default function LocationsPage() {
  return (
    <section className="flex min-h-screen flex-col bg-[#0f0f10]">
      <div className="relative">
        <Header />
      </div>
      <main className="flex-1">
        <LocationDirectory />
      </main>
      <FooterSection hideLocationsSection />
    </section>
  );
}

