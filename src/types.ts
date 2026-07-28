export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  priority: TicketPriority;
  createdAt: string;
  tags: string[];
  previousReplies?: number;
}

export type ReplyTone = "formal" | "concise" | "empathetic";

export interface ReplySuggestion {
  id: string;
  tone: ReplyTone;
  label: string;
  body: string;
  confidence: number; // 0-1, mock "model confidence"
}

export type ComposerStatus =
  | "idle"
  | "generating"
  | "ready"
  | "error";

export interface GenerateReplyRequest {
  ticket: Ticket;
}

export interface ReplyGenerator {
  generateReplies(request: GenerateReplyRequest): Promise<ReplySuggestion[]>;
}
