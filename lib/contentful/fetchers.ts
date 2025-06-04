import { Blog, BlogOrder, GetBlogsDocument } from '@/generated/contentful'

import { client } from './client'

const PAGINATION_LIMIT = 1000 // Contentful's max items per page

export async function getAllBlogs(): Promise<Blog[]> {
  let allBlogs = []
  let hasMore = true
  let skip = 0

  while (hasMore) {
    const { blogCollection } = await client.request(GetBlogsDocument, {
      limit: PAGINATION_LIMIT,
      skip,
      order: [BlogOrder.FeedDateDesc],
    })

    const items = blogCollection?.items ?? []
    allBlogs.push(...items)

    hasMore = items.length === PAGINATION_LIMIT
    skip += PAGINATION_LIMIT
  }

  return allBlogs
}

export async function getBlog(slug: string) {
  const { blogCollection } = await client.request(GetBlogsDocument, {
    filter: { slug },
  })
  return blogCollection?.items[0]
}
