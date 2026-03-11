// Real AI analysis using OpenRouter API

export interface ClauseFlag {
  type: "warning" | "danger" | "info";
  title: string;
  text: string;
  explanation: string;
}

export interface DocumentAnalysis {
  summary: string;
  clauses: ClauseFlag[];
  riskLevel: "low" | "medium" | "high";
  keyTerms: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UploadedDocument {
  id: string;
  index: number;
  name: string;
  text: string;
}

export type SupportedLanguage = "english" | "hindi" | "marathi";

const languageLabels: Record<SupportedLanguage, string> = {
  english: "English",
  hindi: "Hindi",
  marathi: "Marathi",
};

const getApiKey = (): string => {
  const key = (import.meta.env.VITE_OPENROUTER_API_KEY || "").trim();
  console.log("API Key loaded:", key ? `Yes (length: ${key.length})` : "No");
  return key;
};

async function callOpenRouter(messages: { role: "system" | "user"; content: string }[]): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === "your_api_key_here" || apiKey.trim() === "") {
    throw new Error("OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.");
  }

  if (apiKey.startsWith("AIza")) {
    throw new Error(
      "VITE_OPENROUTER_API_KEY is using a Google-style API key (AIza...). Replace it with a real OpenRouter key from https://openrouter.ai/settings/keys."
    );
  }

  console.log("Calling OpenRouter API...");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "LegalEase Friend",
    },
    body: JSON.stringify({
      model: "stepfun/step-3.5-flash:free",
      messages,
      temperature: 0.7,
    }),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenRouter API error response:", error);
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  console.log("API Response received");
  return data.choices[0].message.content;
}

export async function analyzeDocument(
  text: string,
  documentName = "Document",
  language: SupportedLanguage = "english"
): Promise<DocumentAnalysis> {
  const outputLanguage = languageLabels[language];
  const systemPrompt = `You are a legal document analyzer. Analyze the provided legal document and return a structured JSON response.

Return ONLY valid JSON (no markdown formatting) with this exact structure:
{
  "summary": "A summary of the document in 2-3 sentences",
  "clauses": [
    {
      "type": "danger" or "warning" or "info",
      "title": "Short descriptive title of the clause",
      "text": "The actual clause text from the document",
      "explanation": "Explanation of what this means for the reader"
    }
  ],
  "riskLevel": "low" or "medium" or "high",
  "keyTerms": ["key term 1", "key term 2", "key term 3", "key term 4", "key term 5"]
}

Focus on identifying:
- Dangerous clauses that could seriously harm the reader
- Warning clauses that need attention
- Informational clauses worth knowing
- Auto-renewal, early termination fees, liability limitations, arbitration clauses, etc.

Return all user-facing text in ${outputLanguage}. Keep JSON keys in English.
Be thorough but concise.`;

  const userPrompt = `Analyze this legal document titled "${documentName}" and write the response in ${outputLanguage}:\n\n${text}`;

  try {
    const response = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    const cleanResponse = response.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanResponse);

    return {
      summary: parsed.summary || "Unable to generate summary.",
      clauses: parsed.clauses || [],
      riskLevel: parsed.riskLevel || "medium",
      keyTerms: parsed.keyTerms || [],
    };
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
}

let documentContext = "";
let documentContextName = "Document";
let responseLanguage: SupportedLanguage = "english";

export function setDocumentContext(
  text: string,
  documentName = "Document",
  language: SupportedLanguage = "english"
) {
  documentContext = text;
  documentContextName = documentName;
  responseLanguage = language;
}

export async function getChatResponse(question: string): Promise<string> {
  if (!documentContext) {
    return "No documents have been analyzed yet. Please upload one or more documents first.";
  }

  const systemPrompt = `You are a helpful legal document assistant. You are answering questions about a legal document titled "${documentContextName}".

The document content is:
---
${documentContext}
---

When answering:
- Be helpful and friendly
- Use plain English, avoid legal jargon
- If you're unsure, say so
- Keep answers concise but informative
- Base your answers only on the document content provided
- Refer to the selected document by name when useful
- Respond in ${languageLabels[responseLanguage]}`;

  try {
    const response = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ]);

    return response;
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error processing your question. Please try again.";
  }
}
