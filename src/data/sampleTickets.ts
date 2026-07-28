import type { Ticket } from "../types";

export const sampleTickets: Ticket[] = [
  {
    id: "4821",
    customerName: "Maria Santos",
    customerEmail: "maria.santos@email.com",
    subject: "Refund not processed after 2 weeks",
    message:
      "I cancelled my subscription on the 3rd and was told I'd get a refund within 5-7 business days. It has now been over two weeks and I still haven't received anything. This is really frustrating and I need this resolved.",
    priority: "high",
    createdAt: "2026-07-26T09:14:00Z",
    tags: ["billing", "refund"],
    previousReplies: 1,
  },
  {
    id: "4822",
    customerName: "Jordan Lee",
    customerEmail: "jordan.lee@email.com",
    subject: "App crashes when uploading photos",
    message:
      "Every time I try to upload more than 3 photos at once, the app crashes and I lose my draft. This has happened 4 times today. Not working at all.",
    priority: "urgent",
    createdAt: "2026-07-27T14:02:00Z",
    tags: ["bug", "mobile"],
    previousReplies: 0,
  },
  {
    id: "4823",
    customerName: "Priya Anand",
    customerEmail: "priya.anand@email.com",
    subject: "Question about order delay",
    message:
      "Hi, just checking in — my order #10234 was supposed to arrive yesterday but tracking hasn't updated. Is everything okay with the shipment?",
    priority: "medium",
    createdAt: "2026-07-27T18:40:00Z",
    tags: ["shipping"],
    previousReplies: 0,
  },
  {
    id: "4824",
    customerName: "Tom Whitfield",
    customerEmail: "tom.w@email.com",
    subject: "How do I export my data?",
    message:
      "Can you point me to instructions for exporting all my account data as a CSV? Not urgent, just planning ahead.",
    priority: "low",
    createdAt: "2026-07-25T11:20:00Z",
    tags: ["how-to"],
    previousReplies: 0,
  },
];
