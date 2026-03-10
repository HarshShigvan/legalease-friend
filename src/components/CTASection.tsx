import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to decode the{" "}
            <span className="text-primary text-glow">fine print</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 font-body leading-relaxed">
            Stop guessing. Start understanding. Upload your document and get instant clarity.
          </p>
          <Button
            size="lg"
            className="rounded-full text-base px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-md transition-all font-semibold"
            onClick={() => navigate("/upload")}
          >
            Try LegalEase AI — It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-6 text-sm text-muted-foreground font-mono">
            No signup required · Free forever · Your docs stay private
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
