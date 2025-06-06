'use server'

import { SubmissionResult } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

export async function handleEmailFormSubmission(
  _prevState: { lastResult: SubmissionResult | null; successMessage?: string } | null,
  formData: FormData
) {
  const schema = z.object({
    email: z.string().email(),
  })
  const submission = parseWithZod(formData, { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply({ formErrors: ['Boom!'] }) }
  }
  return { lastResult: submission.reply(), successMessage: 'Subscribed!' }
}
