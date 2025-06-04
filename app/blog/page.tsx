import { formatBlogs } from '@/lib/contentful/client'
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { BlogPostList } from '@/vibes/soul/sections/blog-post-list'
import { SectionLayout } from '@/vibes/soul/sections/section-layout'

export default async function Page() {
  const blogs = await getAllBlogs()
  const formattedBlogs = formatBlogs(blogs, false)
  return (
    <SectionLayout>
      <BlogPostList blogPosts={formattedBlogs} />
    </SectionLayout>
  )
}
