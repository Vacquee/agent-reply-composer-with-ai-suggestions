import type { CustomerMessage } from '../types'

export const sampleMessage: CustomerMessage = {
  id: 'msg-1001',
  customerName: 'Jordan Reyes',
  body: `Hi, I was charged twice for my last order (#48213) and I still haven't received a shipping confirmation. Can you help me sort this out? I need this resolved before Friday if possible.`,
  receivedAt: '2026-07-28T09:14:00.000Z',
}
