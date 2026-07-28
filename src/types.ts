export interface CustomerMessage {
  id: string
  customerName: string
  body: string
  receivedAt: string // ISO timestamp
}

/**
 * Lifecycle of the AI draft:
 * - idle: no generation attempted yet, draft may be empty or user-typed
 * - loading: generation in flight
 * - success: last generation attempt succeeded (draft may since have been edited)
 * - error: last generation attempt failed
 */
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'
