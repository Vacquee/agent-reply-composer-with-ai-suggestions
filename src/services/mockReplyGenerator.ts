import type {
  GenerateReplyRequest,
  ReplyGenerator,
  ReplySuggestion,
  Ticket,
} from "../types";

// This is a MOCK. It builds plausible replies from ticket fields using
// templates, not a language model. Swap this file out for a real API call
// (see ReplyGenerator interface) without touching any UI code.

function firstName(fullName: string): string {
  return fullName.trim().split(" ")[0] ?? fullName;
}

function summarizeIssue(ticket: Ticket): string {
  const msg = ticket.message.toLowerCase();
  if (msg.includes("refund")) return "your refund request";
  if (msg.includes("cancel")) return "your cancellation request";
  if (msg.includes("broken") || msg.includes("not working"))
    return "the issue you're experiencing";
  if (msg.includes("late") || msg.includes("delay"))
    return "the delay with your order";
  return `your message about "${ticket.subject}"`;
}

function buildFormal(ticket: Ticket): string {
  const name = firstName(ticket.customerName);
  const issue = summarizeIssue(ticket);
  return `Dear ${name},

Thank you for reaching out regarding ${issue}. I have reviewed the details of your case (Ticket #${ticket.id}) and want to assure you that we are addressing this with priority.

Based on the information provided, our next step is to investigate the matter further and provide you with a resolution within 1-2 business days. Should you have any additional details that could assist us, please don't hesitate to share them.

We appreciate your patience and apologize for any inconvenience this may have caused.

Kind regards,
Customer Support Team`;
}

function buildConcise(ticket: Ticket): string {
  const name = firstName(ticket.customerName);
  const issue = summarizeIssue(ticket);
  return `Hi ${name},

Thanks for flagging ${issue}. We're on it — expect an update within 1-2 business days.

Let us know if anything changes on your end in the meantime.

— Support`;
}

function buildEmpathetic(ticket: Ticket): string {
  const name = firstName(ticket.customerName);
  const issue = summarizeIssue(ticket);
  return `Hi ${name},

I'm sorry for the frustration this has caused — that's not the experience we want you to have. I completely understand why ${issue} would be concerning, and I want you to know we're taking it seriously.

I'm personally looking into this now and will follow up within 1-2 business days with a clear resolution. Thank you for your patience with us here.

Warmly,
Customer Support Team`;
}

function confidenceFor(ticket: Ticket, tone: string): number {
  // Mock confidence heuristic: shorter/angrier messages lower "confidence"
  // for formal tone, urgent tickets raise confidence for empathetic tone.
  // This is illustrative only, not a real model signal.
  let base = 0.78;
  if (ticket.priority === "urgent" && tone === "empathetic") base += 0.12;
  if (ticket.priority === "low" && tone === "concise") base += 0.08;
  if (ticket.message.length < 60) base -= 0.1;
  return Math.max(0.4, Math.min(0.97, base));
}

const ARTIFICIAL_LATENCY_MS = 900;

export class MockReplyGenerator implements ReplyGenerator {
  async generateReplies(
    request: GenerateReplyRequest
  ): Promise<ReplySuggestion[]> {
    const { ticket } = request;

    await new Promise((resolve) =>
      setTimeout(resolve, ARTIFICIAL_LATENCY_MS)
    );

    // Simulate occasional failure so the UI's error state is real, not decorative.
    if (Math.random() < 0.06) {
      throw new Error("Generation failed. The model did not return a response.");
    }

    const suggestions: ReplySuggestion[] = [
      {
        id: `${ticket.id}-formal`,
        tone: "formal",
        label: "Formal",
        body: buildFormal(ticket),
        confidence: confidenceFor(ticket, "formal"),
      },
      {
        id: `${ticket.id}-concise`,
        tone: "concise",
        label: "Concise",
        body: buildConcise(ticket),
        confidence: confidenceFor(ticket, "concise"),
      },
      {
        id: `${ticket.id}-empathetic`,
        tone: "empathetic",
        label: "Empathetic",
        body: buildEmpathetic(ticket),
        confidence: confidenceFor(ticket, "empathetic"),
      },
    ];

    return suggestions;
  }
}

export const replyGenerator: ReplyGenerator = new MockReplyGenerator();
