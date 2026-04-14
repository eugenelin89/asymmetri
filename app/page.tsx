import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { InfrastructureSection } from "@/components/infrastructure-section";
import { ProblemSection } from "@/components/problem-section";
import { ProofSection } from "@/components/proof-section";
import { VisionSection } from "@/components/vision-section";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,151,255,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(98,212,255,0.10),transparent_24%),linear-gradient(180deg,#050816_0%,#040611_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.06]" />
      <Header />
      <div className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <InfrastructureSection />
        <ProofSection />
        <VisionSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
