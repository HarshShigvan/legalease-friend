import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ShieldAlert, MessageCircle, Lock } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Plain-English Summaries",
    description:
      "Upload any legal doc and get a clear, jargon-free summary. Like a translator for lawyer-speak.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ShieldAlert,
    title: "Sneaky Clause Detection",
    description:
      "We flag the tricky stuff — hidden fees, auto-renewals, liability traps — before they bite you.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: MessageCircle,
    title: "Chat-Style Q&A",
    description:
      "Got a question about Section 4, Paragraph B? Just ask. It's like texting a really smart buddy.",
    color: "text-soft-teal",
    bg: "bg-soft-teal/10",
  },
  {
    icon: Lock,
    title: "Privacy First, Always",
    description:
      "Your documents stay yours. We don't store, share, or peek. Pinky promise. 🤞",
    color: "text-gentle-green",
    bg: "bg-gentle-green/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
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
            What LegalEase AI Does for You
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Think of us as your legal document sidekick — always ready, always on your side.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow bg-card rounded-2xl">
                <CardContent className="p-6 pt-8">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-body text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
