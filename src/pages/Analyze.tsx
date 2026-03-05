import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  ShieldAlert,
  AlertTriangle,
  Info,
  FileText,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import {
  analyzeDocument,
  getChatResponse,
  setDocumentContext,
  type DocumentAnalysis,
  type ChatMessage,
} from "@/lib/mockAnalysis";

const Analyze = () => {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "chat">("summary");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const doc = sessionStorage.getItem("legalease_doc");
    if (!doc) {
      navigate("/upload");
      return;
    }
    
    // Set document context for chat
    setDocumentContext(doc);
    
    // Call real AI API
    analyzeDocument(doc)
      .then((result) => {
        setAnalysis(result);
        setIsAnalyzing(false);
        setMessages([
          {
            role: "assistant",
            content:
              "Hey! 👋 I've finished analyzing your document. I found a few things you should know about. Feel free to ask me anything — like \"What happens if I break the lease early?\" or \"Is there an auto-renewal clause?\"",
          },
        ]);
      })
      .catch((err) => {
        console.error("Analysis failed:", err);
        setError(err.message || "Unknown error occurred");
        setIsAnalyzing(false);
        setMessages([
          {
            role: "assistant",
            content: "Sorry, I encountered an error analyzing your document. Please check your API key and try again.",
          },
        ]);
      });
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await getChatResponse(input);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clauseIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-accent" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const clauseBadge = (type: string) => {
    switch (type) {
      case "danger":
        return <Badge variant="destructive">High Risk</Badge>;
      case "warning":
        return <Badge className="bg-accent text-accent-foreground">Caution</Badge>;
      default:
        return <Badge variant="secondary">FYI</Badge>;
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Analyzing your document...
          </h2>
          <p className="text-muted-foreground font-body">
            Reading the fine print so you don't have to ☕
          </p>
          <div className="mt-6 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Show error if analysis failed
  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Analysis Failed
          </h2>
          <p className="text-muted-foreground font-body mb-4">
            {error || "An unknown error occurred while analyzing your document."}
          </p>
          <div className="bg-secondary/60 rounded-xl p-4 text-left mb-4">
            <p className="text-sm font-body text-foreground">
              <strong>Troubleshooting:</strong>
            </p>
            <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
              <li>Make sure VITE_OPENROUTER_API_KEY is set in .env</li>
              <li>Restart the dev server after adding the key</li>
              <li>Check your API key is valid at openrouter.ai</li>
            </ul>
          </div>
          <Button
            onClick={() => navigate("/upload")}
            className="rounded-full"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/upload")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Upload Another
          </Button>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "summary" ? "default" : "outline"}
              onClick={() => setActiveTab("summary")}
              className="rounded-full"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Summary
            </Button>
            <Button
              variant={activeTab === "chat" ? "default" : "outline"}
              onClick={() => setActiveTab("chat")}
              className="rounded-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </div>
        </div>

        {activeTab === "summary" ? (
          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Risk Level */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      analysis.riskLevel === "high"
                        ? "bg-destructive/10"
                        : analysis.riskLevel === "medium"
                        ? "bg-accent/10"
                        : "bg-primary/10"
                    }`}
                  >
                    <ShieldAlert
                      className={`h-6 w-6 ${
                        analysis.riskLevel === "high"
                          ? "text-destructive"
                          : analysis.riskLevel === "medium"
                          ? "text-accent"
                          : "text-primary"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Overall Risk:{" "}
                      <span className="capitalize">{analysis.riskLevel}</span>
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {analysis.riskLevel === "high"
                        ? "Proceed with caution — there are significant concerns."
                        : analysis.riskLevel === "medium"
                        ? "Some things to watch out for, but manageable."
                        : "Looks pretty standard — nothing too scary."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {analysis.keyTerms.map((term) => (
                    <Badge key={term} variant="secondary" className="rounded-full font-body">
                      {term}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  📝 Plain-English Summary
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {analysis.summary}
                </p>
              </CardContent>
            </Card>

            {/* Flagged Clauses */}
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                🚩 Flagged Clauses ({analysis.clauses.length})
              </h3>
              <div className="space-y-4">
                {analysis.clauses.map((clause, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-0 shadow-md rounded-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          {clauseIcon(clause.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-display font-semibold text-foreground">
                                {clause.title}
                              </h4>
                              {clauseBadge(clause.type)}
                            </div>
                            <p className="text-sm text-muted-foreground font-body italic mb-3">
                              "{clause.text}"
                            </p>
                            <div className="bg-secondary/60 rounded-xl p-4">
                              <p className="text-sm font-body text-foreground leading-relaxed">
                                {clause.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => setActiveTab("chat")}
                className="rounded-full px-8 shadow-lg shadow-primary/25"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask Questions About This Document
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Chat Tab */
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-0">
                <div className="h-[60vh] flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <p className="text-sm font-body whitespace-pre-line">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-muted-foreground"
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggestions */}
                  {messages.length <= 1 && (
                    <div className="px-6 pb-2">
                      <div className="flex flex-wrap gap-2">
                        {[
                          "What happens if I break the lease early?",
                          "Is there an auto-renewal clause?",
                          "What about the security deposit?",
                          "Can I have pets?",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setInput(q);
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-body"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your document..."
                        className="rounded-full font-body"
                      />
                      <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
