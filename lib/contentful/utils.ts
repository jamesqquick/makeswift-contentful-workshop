import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

import { BlogPost } from '@/vibes/soul/primitives/blog-post-card'

import { QueriedBlogPost } from './fetchers'

export const formatBlogs = (blogs: QueriedBlogPost[], includeBody: boolean = true): BlogPost[] => {
  return blogs.map(blog => formatBlog(blog, includeBody))
}

export const formatBlog = (blog: QueriedBlogPost, includeBody: boolean = true): BlogPost => {
  if (!blog.title || !blog.publishDate || !blog.body || !blog.banner?.url || !blog.body?.json) {
    throw new Error('Blog post is missing required fields: title, publishDate, or body')
  }
  return {
    title: blog.title,
    date: new Date(blog.publishDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    content: includeBody ? documentToHtmlString(blog.body.json) : blog.description,
    image: blog.banner ? { src: blog.banner.url, alt: blog.title } : null,
    author: blog.author,
    href: `/blog/${blog.slug}`,
  }
}
