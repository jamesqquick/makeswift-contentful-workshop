import { notFound } from 'next/navigation'

import { getBlog } from '@/lib/contentful/fetchers'
import { formatBlog } from '@/lib/contentful/utils'
import { BlogPostContent } from '@/vibes/soul/sections/blog-post-content'

export async function generateStaticParams() {
  //TODO: implement this function to generate static params for all blog posts
  return []
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  //TODO: get slug from params
  //TODO: fetch the blog post using the slug
  //TODO: format the blog post

  return <p>TODO: display blog content</p>
}
