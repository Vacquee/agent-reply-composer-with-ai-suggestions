import { CustomerMessage } from './components/CustomerMessage'
import { ReplyComposer } from './components/ReplyComposer'
import { sampleMessage } from './data/sampleMessage'
import './App.css'

function App() {
  function handleSend(reply: string) {
    // Frontend-only demo: sending is simulated by logging.
    // In a real app this would call a backend API.
    console.log('Reply sent:', reply)
  }

  return (
    <main className="app">
      <h1>Agent Reply Composer</h1>
      <CustomerMessage message={sampleMessage} />
      <ReplyComposer message={sampleMessage} onSend={handleSend} />
    </main>
  )
}

export default App
