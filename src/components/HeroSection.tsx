import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-grid">
      {/* Gradient overlays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm font-medium text-muted-foreground font-mono">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              AI-powered legal analysis
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Decode legal docs{" "}
            <span className="text-primary text-glow">instantly</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-body"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Upload any contract, lease, or legal document. Get plain-English summaries, 
            flagged clauses, and instant answers — no law degree required.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Button
              size="lg"
              className="rounded-full text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-md transition-all font-semibold"
              onClick={() => navigate("/upload")}
            >
              Try LegalEase AI
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base px-8 py-6 border-border text-foreground hover:bg-secondary/50 hover:border-primary/30 transition-all"
              onClick={scrollToHowItWorks}
            >
              See How It Works
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
