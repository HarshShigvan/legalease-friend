import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, FileText, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Upload = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("paste");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // For demo: simulate reading a PDF with mock text
      const mockPdfText = `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Agreement") is entered into between the Landlord and Tenant for the property located at 123 Main Street.

1. TERM: The lease term shall be for 12 months commencing on January 1, 2026.

2. RENT: Tenant agrees to pay monthly rent of $1,500, due on the first of each month. Late payments incur a $75 fee after 5 days.

3. SECURITY DEPOSIT: Tenant shall pay a security deposit of $1,500. Security deposit shall be returned within 45 days of lease termination, less any deductions for damages.

4. AUTO-RENEWAL: Lease automatically renews for successive 12-month periods unless written notice is given 60 days prior to expiration.

5. EARLY TERMINATION: Tenant shall pay a fee equal to two months' rent upon early termination of this agreement.

6. MAINTENANCE: Tenant is responsible for all repairs and maintenance costs not exceeding $150 per incident.

7. PETS: A non-refundable pet deposit of $300 is required. Maximum 2 pets allowed.

8. UTILITIES: Tenant is responsible for all utilities including electricity, water, gas, and internet.`;
      setText(mockPdfText);
    }
  };

  const handleAnalyze = () => {
    if (text.trim()) {
      // Store text in sessionStorage for the analysis page
      sessionStorage.setItem("legalease_doc", text);
      navigate("/analyze");
    }
  };

  const hasContent = text.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Upload Your Document
            </h1>
            <p className="text-muted-foreground text-lg font-body">
              Drop a PDF or paste your legal text — we'll do the heavy reading. 📄
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-6 justify-center">
            <Button
              variant={activeTab === "paste" ? "default" : "outline"}
              onClick={() => setActiveTab("paste")}
              className="rounded-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Paste Text
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              onClick={() => setActiveTab("upload")}
              className="rounded-full"
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload PDF
            </Button>
          </div>

          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-6">
              {activeTab === "paste" ? (
                <Textarea
                  placeholder="Paste your legal document text here... (e.g., a lease agreement, contract, terms of service)"
                  className="min-h-[300px] text-sm font-body resize-none border-muted rounded-xl"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              ) : (
                <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-xl p-8">
                  <label className="cursor-pointer text-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <UploadIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-display text-lg font-semibold text-foreground mb-2">
                      {fileName || "Click to upload a file"}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      PDF, DOC, DOCX, or TXT files supported
                    </p>
                  </label>
                  {fileName && (
                    <p className="mt-4 text-sm text-primary font-medium font-body">
                      ✅ {fileName} loaded successfully
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow-lg shadow-primary/25"
                  disabled={!hasContent}
                  onClick={handleAnalyze}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze Document
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6 font-body">
            🔒 Your documents stay private — nothing is stored or shared. This is a demo for demonstration purposes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
