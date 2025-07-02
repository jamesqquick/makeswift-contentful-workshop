import { BlogPostOrder, GetBlogsDocument, GetBlogsQuery } from '@/generated/contentful'

import { client } from './client'
import { BlogPostFromQuery } from './utils'

const PAGINATION_LIMIT = 100 // Contentful's max items per page

export async function getAllBlogs(): Promise<BlogPostFromQuery[]> {
  let allBlogs: BlogPostFromQuery[] = []
  let hasMore = true
  let skip = 0

  while (hasMore) {
    const { blogPostCollection } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
      limit: PAGINATION_LIMIT,
      skip,
      order: [BlogPostOrder.FeedDateDesc],
    })

    const items = blogPostCollection?.items ?? []
    allBlogs.push(...items.filter((item): item is BlogPostFromQuery => Boolean(item)))

    hasMore = items.length === PAGINATION_LIMIT
    skip += PAGINATION_LIMIT
  }

  return allBlogs
}

export async function getBlog(slug: string) {
  const { blogPostCollection } = await client.request<GetBlogsQuery>(GetBlogsDocument, {
    filter: { slug },
  })
  return blogPostCollection?.items[0] ?? null
}
