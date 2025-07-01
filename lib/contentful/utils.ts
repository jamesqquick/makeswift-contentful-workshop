import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document } from '@contentful/rich-text-types'

import { GetBlogsQuery } from '@/generated/contentful'
import { BlogPost as FormattedBlogPost } from '@/vibes/soul/primitives/blog-post-card'

export type BlogPostFromQuery = NonNullable<
  NonNullable<GetBlogsQuery['blogPostCollection']>['items'][0]
>

export const formatBlogs = (
  blogs: BlogPostFromQuery[],
  includeBody: boolean = true
): FormattedBlogPost[] => {
  return blogs.map(blog => formatBlog(blog, includeBody))
}

export const formatBlog = (
  blog: BlogPostFromQuery,
  includeBody: boolean = true
): FormattedBlogPost => {
  if (!blog.title || !blog.feedDate || !blog.body || !blog.banner?.url || !blog.body?.json) {
    throw new Error('Blog post is missing required fields: title, feedDate, or body')
  }
  return {
    title: blog.title,
    date: new Date(blog.feedDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: includeBody ? documentToHtmlString(blog.body.json as Document) : blog.description,
    image: blog.banner ? { src: blog.banner.url, alt: blog.title } : null,
    author: blog.author?.name,
    href: `/blog/${blog.slug}`,
  }
}
