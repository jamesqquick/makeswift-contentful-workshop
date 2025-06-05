import { BlogPostOrder, GetBlogsDocument } from '@/generated/contentful'

import { client } from './client'

const PAGINATION_LIMIT = 100 // Contentful's max items per page

export type QueriedBlogPost = {
  __typename: 'BlogPost'
  _id: string
  slug: string
  title: string
  description: string
  publishDate: string
  author: string
  body: {
    __typename?: 'BlogPostBody'
    json: {
      [key: string]: any
    }
  }
  banner?: {
    __typename: 'Asset'
    title: string
    description: string
    contentType: string
    fileName: string
    url: string
    width: number
    height: number
  } | null
}

export async function getAllBlogs(): Promise<QueriedBlogPost[]> {
  let allBlogs = []
  let hasMore = true
  let skip = 0

  while (hasMore) {
    const { blogPostCollection } = await client.request(GetBlogsDocument, {
      limit: PAGINATION_LIMIT,
      skip,
      order: [BlogPostOrder.PublishDateDesc],
    })

    const items = blogPostCollection?.items ?? []
    allBlogs.push(...items)

    hasMore = items.length === PAGINATION_LIMIT
    skip += PAGINATION_LIMIT
  }

  return allBlogs as unknown as QueriedBlogPost[]
}

export async function getBlog(slug: string): Promise<QueriedBlogPost | null> {
  const { blogPostCollection } = await client.request(GetBlogsDocument, {
    filter: { slug },
  })
  return (blogPostCollection?.items[0] as unknown as QueriedBlogPost) ?? null
}
