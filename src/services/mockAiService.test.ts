import { describe, expect, it } from 'vitest'
import { generateReply, AiGenerationError } from './mockAiService'
import { sampleMessage } from '../data/sampleMessage'

describe('generateReply', () => {
  it('resolves with a non-empty reply string on success', async () => {
    const reply = await generateReply(sampleMessage, { delayMs: 0, failureRate: 0 })
    expect(typeof reply).toBe('string')
    expect(reply.trim().length).toBeGreaterThan(0)
  })

  it('includes the customer first name in the generated reply', async () => {
    const reply = await generateReply(sampleMessage, { delayMs: 0, failureRate: 0 })
    expect(reply).toContain(sampleMessage.customerName.split(' ')[0])
  })

  it('throws AiGenerationError when failureRate forces a failure', async () => {
    await expect(
      generateReply(sampleMessage, { delayMs: 0, failureRate: 1 }),
    ).rejects.toThrow(AiGenerationError)
  })
})
