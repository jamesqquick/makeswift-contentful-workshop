import React from 'react'

import { useContentfulData } from '@/lib/contentful/provider'
import { formatBlog } from '@/lib/contentful/utils'
import { BlogPostContent } from '@/vibes/soul/sections/blog-post-content'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

import { Warning } from '../Warning'

interface Props {
  children: React.ReactNode
}
export default function BlogContentWithSlot({ children }: Props) {
  const { data: blogs } = useContentfulData()
  if (!blogs || !Array.isArray(blogs) || blogs.length === 0) {
    return <Warning>No blog posts available</Warning>
  }
  const blog = blogs[0]
  if (!blog) {
    return <Warning>No blog post available</Warning>
  }

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
      label: formattedBlog.title,
      href: '#',
    },
  ]
  return (
    <div>
      <BlogPostContent breadcrumbs={breadcrumbs} blogPost={formattedBlog} />
      <SectionLayout>{children}</SectionLayout>
    </div>
  )
}
