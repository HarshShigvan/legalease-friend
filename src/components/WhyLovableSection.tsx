import { motion } from "framer-motion";

const pillars = [
  {
    emoji: "🔒",
    title: "Privacy",
    description:
      "Your secrets stay with you. Documents are processed securely and never stored. We don't train on your data — ever.",
  },
  {
    emoji: "💬",
    title: "Ease",
    description:
      "Upload and chat like texting a buddy. No sign-ups, no hoops, no 47-step onboarding. Just clarity in seconds.",
  },
  {
    emoji: "✨",
    title: "Magic",
    description:
      "Spots sneaky clauses before they bite. Highlights what matters. Makes the complex feel simple — like it should be.",
  },
];

const WhyLovableSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why You'll Love It
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Built with care, designed for real humans — not robots in suits.
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
              <div className="text-5xl mb-5 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                {pillar.emoji}
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
