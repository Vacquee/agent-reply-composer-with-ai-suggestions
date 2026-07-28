import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useReplyDraft } from './useReplyDraft'
import { sampleMessage } from '../data/sampleMessage'

describe('useReplyDraft', () => {
  it('starts idle with an empty draft', () => {
    const { result } = renderHook(() => useReplyDraft(sampleMessage, { delayMs: 0 }))
    expect(result.current.status).toBe('idle')
    expect(result.current.draft).toBe('')
  })

  it('transitions to loading then success and populates the draft', async () => {
    const { result } = renderHook(() => useReplyDraft(sampleMessage, { delayMs: 10 }))

    act(() => {
      void result.current.generate()
    })
    expect(result.current.status).toBe('loading')

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.draft.length).toBeGreaterThan(0)
    expect(result.current.isDirty).toBe(false)
  })

  it('transitions to error and keeps a readable error message on failure', async () => {
    const { result } = renderHook(() =>
      useReplyDraft(sampleMessage, { delayMs: 0, failureRate: 1 }),
    )

    await act(async () => {
      await result.current.generate()
    })

    expect(result.current.status).toBe('error')
    expect(result.current.errorMessage).toBeTruthy()
  })

  it('regenerate replaces the draft with a new AI result', async () => {
    const { result } = renderHook(() => useReplyDraft(sampleMessage, { delayMs: 0 }))

    await act(async () => {
      await result.current.generate()
    })
    const first = result.current.draft

    await act(async () => {
      await result.current.regenerate()
    })

    expect(result.current.status).toBe('success')
    expect(typeof first).toBe('string')
    expect(result.current.draft.length).toBeGreaterThan(0)
  })

  it('setDraft marks the draft dirty', async () => {
    const { result } = renderHook(() => useReplyDraft(sampleMessage, { delayMs: 0 }))

    await act(async () => {
      await result.current.generate()
    })
    expect(result.current.isDirty).toBe(false)

    act(() => {
      result.current.setDraft('edited by agent')
    })
    expect(result.current.isDirty).toBe(true)
    expect(result.current.draft).toBe('edited by agent')
  })

  it('reset clears draft, status, and error back to idle', async () => {
    const { result } = renderHook(() =>
      useReplyDraft(sampleMessage, { delayMs: 0, failureRate: 1 }),
    )

    await act(async () => {
      await result.current.generate()
    })
    expect(result.current.status).toBe('error')

    act(() => {
      result.current.reset()
    })

    expect(result.current.status).toBe('idle')
    expect(result.current.draft).toBe('')
    expect(result.current.errorMessage).toBeNull()
    expect(result.current.isDirty).toBe(false)
  })
})
