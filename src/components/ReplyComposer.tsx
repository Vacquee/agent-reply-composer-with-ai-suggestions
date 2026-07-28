import { useId, useState, type FormEvent } from 'react'
import type { CustomerMessage } from '../types'
import { useReplyDraft } from '../hooks/useReplyDraft'
import './ReplyComposer.css'

interface ReplyComposerProps {
  message: CustomerMessage
  onSend: (reply: string) => void
}

export function ReplyComposer({ message, onSend }: ReplyComposerProps) {
  const { draft, status, errorMessage, setDraft, generate, regenerate, reset } =
    useReplyDraft(message)

  const [validationError, setValidationError] = useState<string | null>(null)
  const [sentReply, setSentReply] = useState<string | null>(null)

  const textareaId = useId()
  const errorId = useId()

  const isLoading = status === 'loading'
  const hasDraft = draft.trim().length > 0

  function handleChange(value: string) {
    setDraft(value)
    if (validationError && value.trim().length > 0) {
      setValidationError(null)
    }
    if (sentReply) {
      setSentReply(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (draft.trim().length === 0) {
      setValidationError('Reply cannot be empty or whitespace only.')
      return
    }

    setValidationError(null)
    onSend(draft.trim())
    setSentReply(draft.trim())
  }

  function handleReset() {
    reset()
    setValidationError(null)
    setSentReply(null)
  }

  return (
    <section className="reply-composer" aria-labelledby="reply-composer-heading">
      <h2 id="reply-composer-heading">Compose reply</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="reply-composer__field">
          <label htmlFor={textareaId}>Reply to customer</label>
          <textarea
            id={textareaId}
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isLoading}
            rows={8}
            aria-required="true"
            aria-invalid={validationError ? true : undefined}
            aria-describedby={validationError ? errorId : undefined}
            placeholder="Generate an AI draft, or write your reply here…"
          />
        </div>

        {validationError && (
          <p id={errorId} className="reply-composer__error" role="alert">
            {validationError}
          </p>
        )}

        {status === 'error' && errorMessage && (
          <p className="reply-composer__error" role="alert">
            {errorMessage}
          </p>
        )}

        {sentReply && (
          <p className="reply-composer__success" role="status">
            Reply sent.
          </p>
        )}

        {/* Polite live region for screen readers, separate from the alert
            regions above so loading state doesn't compete with errors. */}
        <p className="reply-composer__visually-hidden" aria-live="polite">
          {isLoading ? 'Generating AI reply…' : ''}
        </p>

        <div className="reply-composer__actions">
          <button type="button" onClick={() => void generate()} disabled={isLoading}>
            {isLoading ? 'Generating…' : 'Generate AI reply'}
          </button>

          <button
            type="button"
            onClick={() => void regenerate()}
            disabled={isLoading || status === 'idle'}
          >
            {isLoading ? 'Generating…' : 'Regenerate'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || (!hasDraft && status === 'idle')}
          >
            Reset
          </button>

          <button type="submit" disabled={isLoading} className="reply-composer__send">
            Send reply
          </button>
        </div>
      </form>
    </section>
  )
}
