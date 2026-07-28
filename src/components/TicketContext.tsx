import type { Ticket } from "../types";
import "./TicketContext.css";

interface TicketContextProps {
  ticket: Ticket;
}

const priorityLabel: Record<Ticket["priority"], string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TicketContext({ ticket }: TicketContextProps) {
  return (
    <section className="ticket-context" aria-label="Ticket details">
      <header className="ticket-context__header">
        <div>
          <h1 className="ticket-context__subject">{ticket.subject}</h1>
          <div className="ticket-context__meta">
            <span className="ticket-context__ticket-id">
              Ticket #{ticket.id}
            </span>
            <span>·</span>
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
        </div>
        <span className={`priority-pill priority-pill--${ticket.priority}`}>
          {priorityLabel[ticket.priority]}
        </span>
      </header>

      <div className="ticket-context__customer">
        <div className="ticket-context__avatar" aria-hidden="true">
          {ticket.customerName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="ticket-context__customer-name">
            {ticket.customerName}
          </div>
          <div className="ticket-context__customer-email">
            {ticket.customerEmail}
          </div>
        </div>
      </div>

      <div className="ticket-context__message">{ticket.message}</div>

      {ticket.tags.length > 0 && (
        <div className="ticket-context__tags">
          {ticket.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}

      {ticket.previousReplies !== undefined && ticket.previousReplies > 0 && (
        <div className="ticket-context__note">
          {ticket.previousReplies} previous{" "}
          {ticket.previousReplies === 1 ? "reply" : "replies"} on this ticket
        </div>
      )}
    </section>
  );
}
