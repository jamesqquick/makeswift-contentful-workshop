import React from 'react'

import { formatBlog } from '@/lib/contentful/client'
import { useContentfulData } from '@/lib/contentful/provider'
import { BlogPostContent } from '@/vibes/soul/sections/blog-post-content'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

interface Props {
  children: React.ReactNode
}
export default function BlogContentWithSlot({ children }: Props) {
  const { data: blogs } = useContentfulData()
  if (!blogs || blogs.length === 0) {
    return <div>No blog posts available</div>
  }
  const blog = blogs[0]
  const formattedBlog = formatBlog(blog)
  const breadcrumbs = [
    {
      id: '1',
      label: 'Home',
      href: '/',
    },
    {
      id: '2',
      label: 'Blog',
      href: '/blog',
    },
    {
      id: '3',
      label: blog.title,
      href: '#',
    },
  ]
  return (
    <>
      <BlogPostContent breadcrumbs={breadcrumbs} blogPost={formattedBlog} />
      <SectionLayout>{children}</SectionLayout>
    </>
  )
}
