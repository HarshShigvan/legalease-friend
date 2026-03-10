import { motion } from "framer-motion";
import { Shield, Zap, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "Privacy",
    description:
      "Your secrets stay with you. Documents are processed securely and never stored. We don't train on your data — ever.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "Upload and chat in seconds. No sign-ups, no hoops, no 47-step onboarding. Just clarity, instantly.",
  },
  {
    icon: Sparkles,
    title: "Intelligence",
    description:
      "Spots sneaky clauses before they bite. Highlights what matters. Makes the complex feel simple.",
  },
];

const WhyLovableSection = () => {
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why LegalEase AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Built for clarity, designed for real humans.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="w-12 h-12 mx-auto mb-5 rounded-xl border border-border bg-secondary flex items-center justify-center">
                <pillar.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-body">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyLovableSection;
