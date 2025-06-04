import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { GraphQLClient } from 'graphql-request'

import { Blog } from '@/generated/contentful'
import { type BlogPost } from '@/vibes/soul/primitives/blog-post-card'

export const client = new GraphQLClient(
  `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
  {
    errorPolicy: 'all',
    headers: {
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
  }
)

export const formatBlogs = (blogs: Blog[], includeBody: boolean = true): BlogPost[] => {
  return blogs.map(blog => formatBlog(blog, includeBody))
}

export const formatBlog = (blog: Blog, includeBody: boolean = true): BlogPost => ({
  title: blog.title,
  date: new Date(blog.feedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
  content: includeBody ? documentToHtmlString(blog.body.json) : blog.description,
  image: blog.banner ? { src: blog.banner.url, alt: blog.title } : null,
  author: blog.author.name,
  href: `/blog/${blog.slug}`,
})
