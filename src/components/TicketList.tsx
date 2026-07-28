import type { Ticket } from "../types";
import "./TicketList.css";

interface TicketListProps {
  tickets: Ticket[];
  selectedId: string;
  onSelect: (ticket: Ticket) => void;
}

const priorityLabel: Record<Ticket["priority"], string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TicketList({ tickets, selectedId, onSelect }: TicketListProps) {
  return (
    <nav className="ticket-list" aria-label="Ticket queue">
      <div className="ticket-list__header">
        <span>Queue</span>
        <span className="ticket-list__count">{tickets.length}</span>
      </div>
      <ul>
        {tickets.map((ticket) => {
          const isSelected = ticket.id === selectedId;
          return (
            <li key={ticket.id}>
              <button
                className={`ticket-row${isSelected ? " ticket-row--selected" : ""}`}
                onClick={() => onSelect(ticket)}
                aria-current={isSelected ? "true" : undefined}
              >
                <div className="ticket-row__top">
                  <span className={`priority-dot priority-dot--${ticket.priority}`} />
                  <span className="ticket-row__id">#{ticket.id}</span>
                  <span className="ticket-row__time">{timeAgo(ticket.createdAt)}</span>
                </div>
                <div className="ticket-row__subject">{ticket.subject}</div>
                <div className="ticket-row__customer">{ticket.customerName}</div>
                <div className="ticket-row__priority-label">
                  {priorityLabel[ticket.priority]}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
