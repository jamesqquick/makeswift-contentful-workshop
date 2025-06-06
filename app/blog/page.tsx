import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_CONTENT_WITH_SLOT_TYPE } from '@/components/BlogContentWithSlot/BlogContentWithSlot.makeswift'
import { getAllBlogs, getBlog } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { formatBlogs } from '@/lib/contentful/utils'
import { client as MakeswiftClient } from '@/lib/makeswift/client'
import { BlogPostList } from '@/vibes/soul/sections/blog-post-list'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

export default async function Page() {
  //TODO:query the blog posts
  //TODO: format the blog posts

  return (
    <SectionLayout>
      <p>TODO: Replace this with the blog list</p>
    </SectionLayout>
  )
}
