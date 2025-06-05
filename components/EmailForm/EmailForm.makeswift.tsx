import { Style, TextInput } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import EmailForm from '.'

export const EMAIL_FORM_TYPE = 'EmailForm'
runtime.registerComponent(EmailForm, {
  label: 'Email Form',
  type: EMAIL_FORM_TYPE,
  props: {
    placeholder: TextInput({
      label: 'Placeholder',
      defaultValue: 'Enter your email',
    }),
    className: Style(),
  },
})
