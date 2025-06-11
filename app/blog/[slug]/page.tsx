import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_POST_EMBEDDED_COMPONENT_ID } from '@/components/BlogPostCustomizable/BlogPost.makeswift'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

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
