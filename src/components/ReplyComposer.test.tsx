import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReplyComposer } from './ReplyComposer'
import { sampleMessage } from '../data/sampleMessage'
import * as mockAiService from '../services/mockAiService'

function setup(onSend = vi.fn()) {
  render(<ReplyComposer message={sampleMessage} onSend={onSend} />)
  return { onSend }
}

describe('ReplyComposer', () => {
  it('generates an AI reply and populates the textarea', async () => {
    vi.spyOn(mockAiService, 'generateReply').mockResolvedValue('Here is a drafted reply.')
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: /generate ai reply/i }))

    const textarea = await screen.findByRole('textbox', { name: /reply to customer/i })
    await waitFor(() => expect(textarea).toHaveValue('Here is a drafted reply.'))
  })

  it('shows a loading state while generation is in flight', async () => {
    let resolveGeneration: (value: string) => void = () => {}
    vi.spyOn(mockAiService, 'generateReply').mockImplementation(
      () => new Promise((resolve) => (resolveGeneration = resolve)),
    )
    const user = userEvent.setup()
    setup()

    const generateButton = screen.getByRole('button', { name: /generate ai reply/i })
    await user.click(generateButton)

    await waitFor(() => expect(generateButton).toHaveTextContent(/generating…/i))
    expect(generateButton).toBeDisabled()

    resolveGeneration('done')
    await waitFor(() => expect(generateButton).not.toBeDisabled())
  })

  it('prevents sending an empty reply and shows validation feedback', async () => {
    const user = userEvent.setup()
    const { onSend } = setup()

    await user.click(screen.getByRole('button', { name: /send reply/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/cannot be empty/i)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('prevents sending a whitespace-only reply', async () => {
    const user = userEvent.setup()
    const { onSend } = setup()

    const textarea = screen.getByRole('textbox', { name: /reply to customer/i })
    await user.type(textarea, '   ')
    await user.click(screen.getByRole('button', { name: /send reply/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/cannot be empty/i)
    expect(onSend).not.toHaveBeenCalled()
  })

  it('sends a valid, edited reply', async () => {
    const user = userEvent.setup()
    const { onSend } = setup()

    const textarea = screen.getByRole('textbox', { name: /reply to customer/i })
    await user.type(textarea, 'Thanks for reaching out, we will fix this.')
    await user.click(screen.getByRole('button', { name: /send reply/i }))

    expect(onSend).toHaveBeenCalledWith('Thanks for reaching out, we will fix this.')
    expect(await screen.findByRole('status')).toHaveTextContent(/reply sent/i)
  })

  it('regenerate replaces the current draft with a new AI reply', async () => {
    vi.spyOn(mockAiService, 'generateReply')
      .mockResolvedValueOnce('First draft')
      .mockResolvedValueOnce('Second draft')
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: /generate ai reply/i }))
    const textarea = await screen.findByRole('textbox', { name: /reply to customer/i })
    await waitFor(() => expect(textarea).toHaveValue('First draft'))

    await user.click(screen.getByRole('button', { name: /regenerate/i }))
    await waitFor(() => expect(textarea).toHaveValue('Second draft'))
  })

  it('reset clears the draft back to empty', async () => {
    vi.spyOn(mockAiService, 'generateReply').mockResolvedValue('Some draft text')
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: /generate ai reply/i }))
    const textarea = await screen.findByRole('textbox', { name: /reply to customer/i })
    await waitFor(() => expect(textarea).toHaveValue('Some draft text'))

    await user.click(screen.getByRole('button', { name: /^reset$/i }))
    expect(textarea).toHaveValue('')
  })

  it('displays an error message when AI generation fails', async () => {
    vi.spyOn(mockAiService, 'generateReply').mockRejectedValue(
      new mockAiService.AiGenerationError('Something went wrong upstream.'),
    )
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: /generate ai reply/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong upstream/i)
  })
})
