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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050816_0%,#040611_52%,#03050d_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:120px_120px] opacity-[0.028]" />
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
