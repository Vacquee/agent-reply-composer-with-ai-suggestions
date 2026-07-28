import type { CustomerMessage as CustomerMessageType } from '../types'
import './CustomerMessage.css'

interface CustomerMessageProps {
  message: CustomerMessageType
}

export function CustomerMessage({ message }: CustomerMessageProps) {
  const receivedAt = new Date(message.receivedAt)
  const formattedTime = Number.isNaN(receivedAt.getTime())
    ? null
    : receivedAt.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })

  return (
    <article className="customer-message" aria-labelledby="customer-message-heading">
      <header className="customer-message__header">
        <h2 id="customer-message-heading">{message.customerName}</h2>
        {formattedTime && (
          <time className="customer-message__time" dateTime={message.receivedAt}>
            {formattedTime}
          </time>
        )}
      </header>
      <p className="customer-message__body">{message.body}</p>
    </article>
  )
}
