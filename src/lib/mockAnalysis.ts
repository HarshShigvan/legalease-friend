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

// Get API key from environment variable
const getApiKey = (): string => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY || "";
  console.log("API Key loaded:", key ? "Yes (length: " + key.length + ")" : "No");
  return key;
};

// Call OpenRouter API
async function callOpenRouter(messages: { role: "system" | "user"; content: string }[]): Promise<string> {
  const apiKey = getApiKey();
  console.log("Full API Key:", apiKey); // Debug log
  
  if (!apiKey || apiKey === "your_api_key_here" || apiKey.trim() === "") {
    throw new Error("OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.");
  }

  console.log("Calling OpenRouter API..."); // Debug log

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

  console.log("Response status:", response.status); // Debug log

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenRouter API error response:", error); // Debug log
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  console.log("API Response received"); // Debug log
  return data.choices[0].message.content;
}

// Analyze document using real AI
export async function analyzeDocument(text: string): Promise<DocumentAnalysis> {
  const systemPrompt = `You are a legal document analyzer. Analyze the legal document provided and return a structured JSON response.

Return ONLY valid JSON (no markdown formatting) with this exact structure:
{
  "summary": "A plain-English summary of the document in 2-3 sentences",
  "clauses": [
    {
      "type": "danger" or "warning" or "info",
      "title": "Short descriptive title of the clause",
      "text": "The actual clause text from the document",
      "explanation": "Plain-English explanation of what this means for the reader"
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

Be thorough but concise.`;

  const userPrompt = `Analyze this legal document:\n\n${text}`;

  try {
    const response = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    // Parse JSON from response
    const cleanResponse = response.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanResponse);

    // Validate and return the parsed response
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

// Get chat response using real AI
let documentContext = "";

export function setDocumentContext(text: string) {
  documentContext = text;
}

export async function getChatResponse(question: string): Promise<string> {
  if (!documentContext) {
    return "No document has been analyzed yet. Please upload a document first.";
  }

  const systemPrompt = `You are a helpful legal document assistant. You have analyzed a legal document and can answer questions about it.

The document content is:
---
${documentContext}
---

When answering:
- Be helpful and friendly
- Use plain English, avoid legal jargon
- If you're unsure, say so
- Keep answers concise but informative
- Use emojis appropriately to make it friendly
- Base your answers only on the document content provided`;

  const userPrompt = question;

  try {
    const response = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    return response;
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I encountered an error processing your question. Please try again.";
  }
}

