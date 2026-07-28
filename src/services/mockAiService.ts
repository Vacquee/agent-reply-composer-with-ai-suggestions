import type { CustomerMessage } from '../types'

export class AiGenerationError extends Error {
  constructor(message = 'AI reply generation failed. Please try again.') {
    super(message)
    this.name = 'AiGenerationError'
  }
}

export interface GenerateReplyOptions {
  /** Simulated network/model latency in ms. */
  delayMs?: number
  /** Probability (0-1) that generation fails, for exercising error states. */
  failureRate?: number
}

const CLOSERS = [
  "Let me know if there's anything else I can help with.",
  'Thanks for your patience while we get this sorted.',
  "I'll keep an eye on this and follow up if anything changes.",
]

/**
 * Simulates an AI drafting a reply to a customer message.
 * No network/API calls are made — this is entirely mocked so the
 * feature works without a backend or API key.
 */
export async function generateReply(
  message: CustomerMessage,
  options: GenerateReplyOptions = {},
): Promise<string> {
  const { delayMs = 900, failureRate = 0 } = options

  await new Promise((resolve) => setTimeout(resolve, delayMs))

  if (Math.random() < failureRate) {
    throw new AiGenerationError()
  }

  const closer = CLOSERS[Math.floor(Math.random() * CLOSERS.length)]

  return `Hi ${message.customerName.split(' ')[0]}, thanks for reaching out, and sorry for the trouble here. I've looked into this and I'm on it — I'll double-check the duplicate charge and the shipping status on order and get back to you with an update shortly. ${closer}`
}
