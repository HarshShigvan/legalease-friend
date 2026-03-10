import { motion } from "framer-motion";
import { Upload, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload",
    description: "Drop your lease, contract, or any legal doc. PDF or paste text directly.",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Chat",
    description: "Ask questions in plain English. \"What happens if I break the lease early?\"",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Understand",
    description: "Get clear answers, flagged clauses, and a summary you can actually understand.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 border-t border-border bg-grid-sm">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Three steps. That's it.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-border" />

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative z-10 w-14 h-14 mx-auto mb-6 rounded-xl border border-primary/40 bg-secondary flex items-center justify-center glow-sm">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-mono font-medium text-primary tracking-widest uppercase">
                  Step {step.number}
                </span>
                <h3 className="font-display text-2xl font-semibold text-foreground mt-2 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-body text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
