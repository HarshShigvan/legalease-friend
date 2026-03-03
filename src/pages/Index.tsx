import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WhyLovableSection from "@/components/WhyLovableSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <WhyLovableSection />
      <HowItWorksSection />
      <CTASection />
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 LegalEase AI. Made with care for humans who hate fine print.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
