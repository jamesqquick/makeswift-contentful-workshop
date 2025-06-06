import { Slot, Style } from '@makeswift/runtime/controls'

import { runtime } from '@/lib/makeswift/runtime'

import BlogPost from './BlogPost'

export const BLOG_POST_EMBEDDED_COMPONENT_ID = 'blog-post-customizable' //unique id for the registered component

runtime.registerComponent(BlogPost, {
  type: BLOG_POST_EMBEDDED_COMPONENT_ID,
  label: 'Blog Post Customizable',
  props: {
    content: Slot(),
  },
  hidden: true,
})
