import { useCallback, useRef, useState } from 'react'
import type { CustomerMessage, GenerationStatus } from '../types'
import { generateReply, type GenerateReplyOptions } from '../services/mockAiService'

export interface UseReplyDraftResult {
  draft: string
  status: GenerationStatus
  errorMessage: string | null
  /** True once the agent has changed the draft from what the AI generated. */
  isDirty: boolean
  setDraft: (value: string) => void
  generate: () => Promise<void>
  regenerate: () => Promise<void>
  reset: () => void
}

/**
 * Owns the lifecycle of an agent's reply draft: generating it via the
 * (mocked) AI service, tracking loading/error state, and letting the
 * agent edit, regenerate, or reset it. Kept separate from any component
 * so the state machine can be unit tested without rendering UI.
 */
export function useReplyDraft(
  message: CustomerMessage,
  aiOptions?: GenerateReplyOptions,
): UseReplyDraftResult {
  const [draft, setDraftState] = useState('')
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  // Guards against a stale in-flight request clobbering state after
  // reset() or after a newer generate() call has already resolved.
  const requestId = useRef(0)

  const runGeneration = useCallback(async () => {
    const currentRequestId = ++requestId.current
    setStatus('loading')
    setErrorMessage(null)

    try {
      const result = await generateReply(message, aiOptions)
      if (requestId.current !== currentRequestId) return // superseded
      setDraftState(result)
      setIsDirty(false)
      setStatus('success')
    } catch (err) {
      if (requestId.current !== currentRequestId) return // superseded
      const msg =
        err instanceof Error ? err.message : 'AI reply generation failed. Please try again.'
      setErrorMessage(msg)
      setStatus('error')
    }
  }, [message, aiOptions])

  const generate = useCallback(() => runGeneration(), [runGeneration])
  const regenerate = useCallback(() => runGeneration(), [runGeneration])

  const setDraft = useCallback((value: string) => {
    setDraftState(value)
    setIsDirty(true)
  }, [])

  const reset = useCallback(() => {
    requestId.current++ // invalidate any in-flight generation
    setDraftState('')
    setStatus('idle')
    setErrorMessage(null)
    setIsDirty(false)
  }, [])

  return { draft, status, errorMessage, isDirty, setDraft, generate, regenerate, reset }
}
