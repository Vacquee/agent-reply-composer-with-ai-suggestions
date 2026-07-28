import { useState } from "react";
import { sampleTickets } from "./data/sampleTickets";
import { TicketList } from "./components/TicketList";
import { TicketContext } from "./components/TicketContext";
import { ReplyComposer } from "./components/ReplyComposer";
import type { Ticket } from "./types";
import "./App.css";

function App() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket>(
    sampleTickets[0]
  );

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__logo">Helpdesk</span>
        <span className="app__divider" />
        <span className="app__section-label">Reply Composer</span>
      </header>
      <div className="app__body">
        <TicketList
          tickets={sampleTickets}
          selectedId={selectedTicket.id}
          onSelect={setSelectedTicket}
        />
        <main className="app__main">
          <TicketContext ticket={selectedTicket} />
          <ReplyComposer key={selectedTicket.id} ticket={selectedTicket} />
        </main>
      </div>
    </div>
  );
}

export default App;
