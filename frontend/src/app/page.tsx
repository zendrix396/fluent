import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import ProblemStatementSection from "@/components/sections/problem-statement";
import Features from "@/components/sections/features";
import HowItWorks from "@/components/sections/how-it-works";
import Testimonials from "@/components/sections/testimonials";
import SupportSection from "@/components/sections/support";
import IntegrationsSection from "@/components/sections/integrations";
import FinalCta from "@/components/sections/final-cta";
import Faq from "@/components/sections/faq";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemStatementSection />
        <Features />
        <HowItWorks />
        <Testimonials />
        <SupportSection />
        <IntegrationsSection />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}