import { Slot } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import BlogContentWithSlot from '.'

export const BLOG_CONTENT_WITH_SLOT_TYPE = 'blogContentWithSlot'

runtime.registerComponent(BlogContentWithSlot, {
  label: 'BlogContentWithSlot',
  type: BLOG_CONTENT_WITH_SLOT_TYPE,
  props: {
    children: Slot(),
  },
})
