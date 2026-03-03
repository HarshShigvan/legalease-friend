import { motion } from "framer-motion";
import { Upload, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload",
    description: "Drop your lease, contract, or any legal doc. We handle PDFs, Word files — you name it.",
  },
  {
    icon: MessageSquare,
    number: "02",
    title: "Chat",
    description: "Ask questions in plain English. \"What happens if I break the lease early?\" — that kind of thing.",
  },
  {
    icon: CheckCircle,
    number: "03",
    title: "Understand",
    description: "Get clear answers, flagged clauses, and a summary you can actually understand. Confidence unlocked. 💪",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-secondary/40">
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
            Three steps. That's it. Seriously.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-border" />

            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary font-body tracking-wider">
                  STEP {step.number}
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
