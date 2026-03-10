import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Send, ShieldAlert, AlertTriangle, Info,
  FileText, MessageCircle, CheckCircle,
} from "lucide-react";
import {
  analyzeDocument, getChatResponse, setDocumentContext,
  type DocumentAnalysis, type ChatMessage,
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
    if (!doc) { navigate("/upload"); return; }
    setDocumentContext(doc);
    analyzeDocument(doc)
      .then((result) => {
        setAnalysis(result);
        setIsAnalyzing(false);
        setMessages([{
          role: "assistant",
          content: "Analysis complete. I found several notable clauses in your document. Ask me anything — like \"What happens if I break the lease early?\" or \"Is there an auto-renewal clause?\"",
        }]);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setIsAnalyzing(false);
        setMessages([{ role: "assistant", content: "Error analyzing document. Please check your API key and try again." }]);
      });
  }, [navigate]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await getChatResponse(input);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally { setIsTyping(false); }
  };

  const clauseIcon = (type: string) => {
    if (type === "danger") return <ShieldAlert className="h-5 w-5 text-destructive" />;
    if (type === "warning") return <AlertTriangle className="h-5 w-5 text-primary" />;
    return <Info className="h-5 w-5 text-muted-foreground" />;
  };

  const clauseBadge = (type: string) => {
    if (type === "danger") return <Badge variant="destructive" className="font-mono text-xs">HIGH RISK</Badge>;
    if (type === "warning") return <Badge className="bg-primary/20 text-primary border border-primary/30 font-mono text-xs">CAUTION</Badge>;
    return <Badge variant="secondary" className="font-mono text-xs">FYI</Badge>;
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-xl border border-primary/40 bg-secondary flex items-center justify-center mx-auto mb-6 glow-md">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Analyzing document...</h2>
          <p className="text-muted-foreground font-mono text-sm">Processing legal text</p>
          <div className="mt-6 flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <motion.div className="text-center max-w-md mx-auto p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-xl border border-destructive/40 bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Analysis Failed</h2>
          <p className="text-muted-foreground font-body mb-4">{error || "An unknown error occurred."}</p>
          <Button onClick={() => navigate("/upload")} className="rounded-full bg-primary text-primary-foreground">Try Again</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/upload")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Upload Another
          </Button>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "summary" ? "default" : "outline"}
              onClick={() => setActiveTab("summary")}
              className={`rounded-full ${activeTab === "summary" ? "bg-primary text-primary-foreground glow-sm" : "border-border text-foreground"}`}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Summary
            </Button>
            <Button
              variant={activeTab === "chat" ? "default" : "outline"}
              onClick={() => setActiveTab("chat")}
              className={`rounded-full ${activeTab === "chat" ? "bg-primary text-primary-foreground glow-sm" : "border-border text-foreground"}`}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Chat
            </Button>
          </div>
        </div>

        {activeTab === "summary" ? (
          <motion.div className="max-w-3xl mx-auto space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Risk Level */}
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                    analysis.riskLevel === "high" ? "border-destructive/40 bg-destructive/10" :
                    analysis.riskLevel === "medium" ? "border-primary/40 bg-primary/10" : "border-border bg-secondary"
                  }`}>
                    <ShieldAlert className={`h-6 w-6 ${
                      analysis.riskLevel === "high" ? "text-destructive" :
                      analysis.riskLevel === "medium" ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-foreground">
                      Risk Level: <span className="capitalize text-primary">{analysis.riskLevel}</span>
                    </h2>
                    <p className="text-sm text-muted-foreground font-body">
                      {analysis.riskLevel === "high" ? "Significant concerns detected." :
                       analysis.riskLevel === "medium" ? "Some items to watch." : "Standard agreement."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {analysis.keyTerms.map((term) => (
                    <Badge key={term} variant="secondary" className="rounded-full font-mono text-xs border border-border">
                      {term}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Plain-English Summary
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">{analysis.summary}</p>
              </CardContent>
            </Card>

            {/* Flagged Clauses */}
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" /> Flagged Clauses ({analysis.clauses.length})
              </h3>
              <div className="space-y-4">
                {analysis.clauses.map((clause, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="border border-border bg-card rounded-xl hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          {clauseIcon(clause.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-display font-semibold text-foreground">{clause.title}</h4>
                              {clauseBadge(clause.type)}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono italic mb-3">"{clause.text}"</p>
                            <div className="bg-secondary/60 border border-border rounded-lg p-4">
                              <p className="text-sm font-body text-foreground leading-relaxed">{clause.explanation}</p>
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
              <Button onClick={() => setActiveTab("chat")} className="rounded-full px-8 bg-primary text-primary-foreground glow-md font-semibold" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" /> Ask Questions
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border bg-card rounded-xl">
              <CardContent className="p-0">
                <div className="h-[60vh] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, i) => (
                      <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-secondary-foreground"
                        }`}>
                          <p className="text-sm font-body whitespace-pre-line">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-secondary border border-border rounded-xl px-4 py-3 flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div key={i} className="w-2 h-2 rounded-full bg-primary"
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 0.5, delay: i * 0.15, repeat: Infinity }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {messages.length <= 1 && (
                    <div className="px-6 pb-2">
                      <div className="flex flex-wrap gap-2">
                        {["What happens if I break the lease early?", "Is there an auto-renewal clause?", "What about the security deposit?", "Can I have pets?"].map((q) => (
                          <button key={q} onClick={() => setInput(q)}
                            className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground hover:border-primary/30 transition-colors font-mono">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 border-t border-border">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                      <Input value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your document..."
                        className="rounded-full font-body bg-secondary border-border focus:border-primary/40" />
                      <Button type="submit" size="icon" className="rounded-full shrink-0 bg-primary text-primary-foreground glow-sm" disabled={!input.trim()}>
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
