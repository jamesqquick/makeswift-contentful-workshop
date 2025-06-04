import { notFound } from 'next/navigation'

import { formatBlog } from '@/lib/contentful/client'
import { getAllBlogs, getBlog } from '@/lib/contentful/fetchers'
import { BlogPostContent } from '@/vibes/soul/sections/blog-post-content'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  const blog = await getBlog(slug)

  if (!blog) return notFound()

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
  return <BlogPostContent breadcrumbs={breadcrumbs} blogPost={formattedBlog} />
}
