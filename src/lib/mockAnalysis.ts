// Mock AI analysis for college project demo

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

const MOCK_ANALYSES: Record<string, DocumentAnalysis> = {
  lease: {
    summary:
      "This is a standard 12-month residential lease agreement. The landlord retains the right to increase rent with 30 days notice. You're responsible for utilities and minor repairs under $100. There's a $500 early termination fee and a non-refundable pet deposit of $300.",
    clauses: [
      {
        type: "danger",
        title: "Auto-Renewal Clause",
        text: "Lease automatically renews for successive 12-month periods unless written notice is given 60 days prior to expiration.",
        explanation:
          "⚠️ This means if you forget to notify your landlord 60 days before your lease ends, you're locked in for another full year. Set a calendar reminder!",
      },
      {
        type: "warning",
        title: "Early Termination Fee",
        text: "Tenant shall pay a fee equal to two months' rent upon early termination of this agreement.",
        explanation:
          "This could cost you a lot. If your rent is $1,500/month, that's $3,000 just to leave early. Try negotiating this down.",
      },
      {
        type: "warning",
        title: "Maintenance Responsibility",
        text: "Tenant is responsible for all repairs and maintenance costs not exceeding $150 per incident.",
        explanation:
          "You'll be paying for small fixes yourself — leaky faucets, clogged drains, etc. This is somewhat standard but the $150 threshold is higher than typical ($50-100).",
      },
      {
        type: "info",
        title: "Security Deposit Return",
        text: "Security deposit shall be returned within 45 days of lease termination, less any deductions for damages.",
        explanation:
          "45 days is within legal limits in most states. Make sure to document the apartment's condition when you move in with photos!",
      },
    ],
    riskLevel: "medium",
    keyTerms: ["12-month term", "Auto-renewal", "$500 early termination", "Tenant pays utilities", "45-day deposit return"],
  },
  default: {
    summary:
      "This legal document contains several standard clauses along with a few provisions that deserve your attention. Overall, the terms are fairly typical but there are some areas where you should proceed with caution.",
    clauses: [
      {
        type: "danger",
        title: "Liability Limitation",
        text: "Party A shall not be held liable for any indirect, incidental, or consequential damages arising from this agreement.",
        explanation:
          "⚠️ This means they're not responsible if something goes wrong indirectly because of this agreement. This is very broad protection for them, not great for you.",
      },
      {
        type: "warning",
        title: "Arbitration Clause",
        text: "Any disputes shall be resolved through binding arbitration rather than court proceedings.",
        explanation:
          "You're giving up your right to sue in court. Arbitration can be faster but often favors the company. Worth knowing before you sign.",
      },
      {
        type: "info",
        title: "Governing Law",
        text: "This agreement shall be governed by and construed in accordance with the laws of the State of Delaware.",
        explanation:
          "Delaware law will apply even if you live elsewhere. This is common for business contracts but could affect your rights.",
      },
    ],
    riskLevel: "medium",
    keyTerms: ["Liability limitation", "Binding arbitration", "Delaware law", "30-day notice period"],
  },
};

export function analyzeDocument(text: string): DocumentAnalysis {
  const lower = text.toLowerCase();
  if (lower.includes("lease") || lower.includes("tenant") || lower.includes("landlord") || lower.includes("rent")) {
    return MOCK_ANALYSES.lease;
  }
  return MOCK_ANALYSES.default;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_RESPONSES: Record<string, string> = {
  "break the lease": "Based on this document, breaking the lease early would cost you an early termination fee equal to two months' rent. You'd also need to give 30 days written notice. My advice? Try to negotiate this clause before signing, or at least document everything when you move in.",
  "auto-renew": "Yes! This lease has an auto-renewal clause — it automatically renews for another 12 months if you don't give written notice 60 days before it ends. I'd recommend setting a reminder on your phone right now. 📅",
  "security deposit": "Your security deposit should be returned within 45 days of moving out, minus any deductions for damages. Pro tip: Take detailed photos of the apartment when you move in AND out. Timestamps are your best friend here.",
  "pet": "There's a non-refundable pet deposit of $300 mentioned in this agreement. Note that it's non-refundable — you won't get this back regardless of your pet's behavior. Some landlords will negotiate this, so it's worth asking.",
  "repair": "Under this agreement, you're responsible for any repairs costing less than $150 per incident. That means minor stuff like unclogging drains or fixing a running toilet is on you. Anything above $150 is the landlord's responsibility.",
};

export function getChatResponse(question: string): string {
  const lower = question.toLowerCase();

  for (const [key, response] of Object.entries(CHAT_RESPONSES)) {
    if (lower.includes(key)) return response;
  }

  return `Great question! Based on my analysis of this document, here's what I can tell you:\n\nThe document doesn't specifically address that exact topic in detail. However, the general terms suggest that standard legal protections apply. I'd recommend:\n\n1. **Check the specific section** related to your concern\n2. **Look for any addendums** that might cover this\n3. **Ask the other party** for clarification before signing\n\nWant me to look at a specific section more closely? 🔍`;
}
