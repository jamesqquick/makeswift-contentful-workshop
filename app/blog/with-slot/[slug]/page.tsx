import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_CONTENT_WITH_SLOT_TYPE } from '@/components/BlogContentWithSlot/BlogContentWithSlot.makeswift'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { getAllBlogs, getBlog } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    `blog-content-with-slot-${slug}`,
    {
      siteVersion: await getSiteVersion(),
    }
  )

  if (componentSnapshot == null) return notFound()

  const blogData = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogData.blogPostCollection) return notFound()

  return (
    <ContentfulProvider value={blogData.blogPostCollection?.items}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Content with Slot"
        type={BLOG_CONTENT_WITH_SLOT_TYPE}
      />
    </ContentfulProvider>
  )
}
