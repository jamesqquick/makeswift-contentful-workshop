'use server'

import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

export async function handleEmailFormSubmission(lastResult, formData) {
  const schema = z.object({
    email: z.string().email(),
  })
  const submission = parseWithZod(formData, { schema })
  console.log(submission)
  if (submission.status !== 'success') {
    return { lastResult: submission.reply({ formErrors: ['Boom!'] }) }
  }
  return { lastResult: submission.reply(), successMessage: 'Subscribed!' }
}
