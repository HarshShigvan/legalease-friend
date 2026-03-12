import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import mammoth from "mammoth";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, FileText, ArrowLeft, ArrowRight, Sparkles, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportedLanguage, UploadedDocument } from "@/lib/mockAnalysis";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const extractPdfText = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;
  const pages = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, pageIndex) => {
      const page = await pdf.getPage(pageIndex + 1);
      const content = await page.getTextContent();
      return content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    })
  );

  return pages.filter(Boolean).join("\n\n");
};

const extractDocxText = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
};

const extractFileText = async (file: File) => {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".txt")) {
    return (await file.text()).trim();
  }

  if (lowerName.endsWith(".pdf")) {
    return extractPdfText(file);
  }

  if (lowerName.endsWith(".docx")) {
    return extractDocxText(file);
  }

  throw new Error(`Unsupported file type: ${file.name}`);
};

const buildCombinedText = (documents: UploadedDocument[]) =>
  documents
    .map((doc, index) => `----- DOCUMENT ${index + 1}: ${doc.name} -----\n${doc.text}`)
    .join("\n\n");

const languageOptions: { value: SupportedLanguage; label: string }[] = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "marathi", label: "Marathi" },
];
const TELEGRAM_BOT_URL = "https://t.me/leagalEase_bot";
const TELEGRAM_QR_LOCAL = "/telegram-bot-qr.jpg";
const TELEGRAM_QR_FALLBACK = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(TELEGRAM_BOT_URL)}`;

const Upload = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("paste");
  const [language, setLanguage] = useState<SupportedLanguage>("english");
  const [qrImageSrc, setQrImageSrc] = useState(TELEGRAM_QR_LOCAL);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const extractedDocuments = await Promise.all(
      files.map(async (file, index) => {
        try {
          const body = await extractFileText(file);
          return {
            id: `doc-${index + 1}-${file.name}`,
            index,
            name: file.name,
            text: body || "[No readable text found in this file.]",
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to read this file.";
          return {
            id: `doc-${index + 1}-${file.name}`,
            index,
            name: file.name,
            text: `[${message}]`,
          };
        }
      })
    );

    setDocuments(extractedDocuments);
    setText(buildCombinedText(extractedDocuments));
  };

  const handleAnalyze = () => {
    const docsToStore = activeTab === "paste"
      ? [{
          id: "doc-1-pasted",
          index: 0,
          name: "Pasted Document",
          text: text.trim(),
        }]
      : documents.filter((doc) => doc.text.trim());

    if (!docsToStore.length) return;

    sessionStorage.setItem("legalease_docs", JSON.stringify(docsToStore));
    sessionStorage.setItem("legalease_doc", buildCombinedText(docsToStore));
    sessionStorage.setItem("legalease_language", language);
    navigate("/analyze");
  };

  const hasContent = text.trim().length > 0;

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="rounded-full border-border bg-card text-foreground hover:border-primary/30 hover:text-primary"
              >
                <a
                  href={TELEGRAM_BOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open LegalEase Telegram bot"
                  title="Chat on Telegram"
                >
                  <Send className="h-4 w-4" />
                </a>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent align="end" side="bottom" className="w-[240px] p-2">
              <img
                src={qrImageSrc}
                alt="LegalEase Telegram bot QR code"
                className="h-auto w-full rounded-md border border-border object-cover"
                onError={() => setQrImageSrc(TELEGRAM_QR_FALLBACK)}
              />
            </HoverCardContent>
          </HoverCard>
        </div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Upload Your Documents
            </h1>
            <p className="text-muted-foreground text-lg font-body">
              Drop one or more files or paste your legal text - we&apos;ll handle the rest.
            </p>
          </div>

          <div className="flex gap-2 mb-6 justify-center">
            <Button
              variant={activeTab === "paste" ? "default" : "outline"}
              onClick={() => setActiveTab("paste")}
              className={`rounded-full ${activeTab === "paste" ? "bg-primary text-primary-foreground glow-sm" : "border-border text-foreground hover:border-primary/30"}`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Paste Text
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              onClick={() => setActiveTab("upload")}
              className={`rounded-full ${activeTab === "upload" ? "bg-primary text-primary-foreground glow-sm" : "border-border text-foreground hover:border-primary/30"}`}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>

          <div className="mb-6 flex justify-center">
            <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
              <SelectTrigger className="w-[180px] rounded-full border-border bg-card">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="border border-border bg-card rounded-xl">
            <CardContent className="p-6">
              {activeTab === "paste" ? (
                <Textarea
                  placeholder="Paste one or more legal documents here..."
                  className="min-h-[300px] text-sm font-body resize-none border-border bg-secondary/50 rounded-lg focus:border-primary/40 placeholder:text-muted-foreground"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setDocuments([]);
                  }}
                />
              ) : (
                <div className="min-h-[300px] flex flex-col items-center justify-center border border-dashed border-border rounded-lg p-8 hover:border-primary/30 transition-colors">
                  <label className="cursor-pointer text-center w-full">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-xl border border-border bg-secondary flex items-center justify-center mx-auto mb-4">
                      <UploadIcon className="h-7 w-7 text-primary" />
                    </div>
                    <p className="font-display text-lg font-semibold text-foreground mb-2">
                      {documents.length ? `${documents.length} file(s) selected` : "Click to upload files"}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      PDF, DOC, DOCX, or TXT files
                    </p>
                  </label>
                  {documents.length > 0 && (
                    <div className="mt-4 w-full max-w-md space-y-1 text-left text-sm text-primary font-mono">
                      {documents.map((doc) => (
                        <p key={doc.id}>- {doc.name} loaded</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-md transition-all font-semibold"
                  disabled={!hasContent}
                  onClick={handleAnalyze}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Documents
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6 font-mono">
            Your documents stay private - nothing is stored or shared.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
