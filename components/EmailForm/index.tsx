import { handleEmailFormSubmission } from '@/actions/email'
import { InlineEmailForm } from '@/vibes/soul/sections/inline-email-form'

export interface EmailFormProps {
  placeholder: string
  className?: string
}

export default function EmailForm({ placeholder, className }: EmailFormProps) {
  return (
    <div className={className}>
      <InlineEmailForm placeholder={placeholder} action={handleEmailFormSubmission} />
    </div>
  )
}
