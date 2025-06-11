# Makeswift Contentful Workshop

Learn how to integrate [Contentful](https://www.contentful.com/) into a Next.js site that is editable inside of [Makeswift](https://makeswift.com/).

## Things to Know

- Makeswift is [HIRING](https://www.makeswift.com/careers)!
- Makeswift booth in the exhibition hall on the right-hand side. Come talk to us!
- [AI Happy Hour (tonight from 5-8)](https://atlanta.aitinkerers.org/p/happy-hour-with-ai-tinkerers-and-okta)

## Prerequisites

To follow along in this workshop, ensure you have met the following prerequisites.

- Contentful account (Free)
- Makeswift account (Free)
- Node.js vs. 20+ installed
- Text editor like VS Code installed

## Intro to Makeswift

For a quick overview of Makeswift, follow the [Quickstart](https://docs.makeswift.com/product/quickstart)

## Getting Started in Makeswift

- Create [Makeswift](https://makeswift.com/) account
- Create new website
  - choose **Start with the builder** then choose **Venture** as the template
- Explore the Visual Builder by creating and editing elements in the Canvas

## Intro to Contentful

Contentful is a Headless CMS that allows you to define structured data to be used in your website. In this workshop, you'll use Contentful to store data associated with a blog.

## Create Data Model in Contentful

Create a new data model in Contentful named `BlogPost` that includes the following properties. Each property marked with "\*" should be flagged as required.

- **slug\*** - Short Text
- **title\*** - Short Text
- **description\*** - Short Text
- **body\*** - Rich text
- **banner** - Media
- **publishDate\*** - Date and Time
- **author\*** - Short text

It's important that the names and types match exactly what is listed here. It should look like this.

![Blog Post content model](/images/blog-post-content-model.png)

Now, add a sample `BlogPost`.

```tsx
{
	slug: 'purify-plants',
	title: `Top 5 Plants to Purify Your Home's Air`,
	description: `The Snake Plant, also known as Mother-in-Law's Tongue, is one of the most effective plants for filtering out several toxins.`,
	content: `The Snake Plant, also known as Mother-in-Law's Tongue, is one of the most effective plants for filtering out several toxins. It thrives in low light, making it perfect for bedrooms and living rooms.`
	author: `Sam Smith`
}
```

If you would like to add the `banner` image, you can download [this image file](https://storage.googleapis.com/s.mkswft.com/RmlsZTo1NGFjNmRiYi0xZDE2LTRiOTEtOWUyZS0zMjY1ZjBmZTk0ZjU=/plant-blog-1.jpeg) and upload to Contentful.

For more realistic data for the `content` property, you can copy the rendered HTML from the preview section of the [Blog Post Content docs](https://vibes.site/docs/soul/blog-post-content) in VIBES. We'll talk more about VIBES later.

You can also copy additional sample blog posts data from the [`Blog Post List`](https://vibes.site/docs/soul/blog-post-list) component docs. **You'll need at least one other post to see appropriate results for a few of the sections below.**

## Local Project Setup

Start by cloning the [Makeswift Contentful Workshop repo](https://github.com/jamesqquick/makeswift-contentful-workshop).

### Connect to Makeswift

Now, you'll need to connect your local project with Makeswift. To do this, first you'll need to update your app's URL. You can do this in Makeswift by going to **Settings > Host** and update the **Host URL** property to `localhost:3000`. While you're there, copy your **Site API Key** as well.

![Makeswift host settings](/images//makeswift-host-settings.jpeg)

Now, in your local code, make a copy of `.env.example` file and name it `.env.local`. Then update the `MAKESWIFT_SITE_API_KEY` property with the API you just copied.

```tsx
    MAKESWIFT_SITE_API_KEY=<YOUR_API_KEY>
```

### Connect to Contentful

Now, you need to get your **Space ID** and **Content Delivery API - access token** from Contenful. You can create new API key by going to **Settings → API Keys** and then click **Add API Key**.

![Contentful API settings](/images/contentful-api-key.jpeg)

Then, update your environment variables in `.env.local` with those values.

```tsx
MAKESWIFT_SITE_API_KEY=<YOUR_API_KEY>
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=<YOUR_SPACE_ID>
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=<YOUR_ACCESS_TOKEN>
```

### Generate TypeScript Types for GraphQl

Now, you'll need to generate the TypeScript types to be used with the GraphQL queries. You can see the GraphQL queries defined in the `/components/Contentful/queries` directory. To generate the types, run the following command.

```tsx
    npm run codegen-ts
```

If you have any issues, ensure your content model in Contentful matches exactly what is defined above.

### Run Locally

Now you can start your application by running:

```bash
    npm run dev
```

In Makeswift, refresh the tab, and you should see it is successfully connected to your locally running project.

## VIBES Components

In this workshop, we're going to use pre-built component from [VIBES](https://vibes.site/) to display blog post cards and content. Specifically, we'll use the following components.

- [Blog Post List](https://vibes.site/docs/soul/blog-post-list)
- [Blog Post Content](https://vibes.site/docs/soul/blog-post-content)

Take some time to explore these components if you're interested. These are copy and paste components and have already been included in the repo, so no action necessary.

## Querying Blog Content for Blog List Page

Now, you'll need to update the blog index page (`/app/blog/page.tsx) to display the list of blog posts from Contentful by:

- Querying posts by calling `getAllBlogs`
- Converting them to format expected by the `BlogPostList` component by calling `formatPosts()`
- Rendering the `<BlogPostList>` component inside of the `<SectionLayout>` component and passing the blog posts

These functions and components have already been imported for you to use. Paste in the following code:

```tsx
import { getAllBlogs } from '@/lib/contentful/fetchers'
import { formatBlogs } from '@/lib/contentful/utils'
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
```

Since this route is defined in the source code, you'll need to manually add this page in Makeswift to see the results. You can do this by creating a new page in the Navigation Sidebar on the left. Update it's name to be **Blog List** and it's path (in the properties sidebar on the right) to `/blog`. After refreshing the page, you should see the results show up appropriately.

![Blog list page in Makeswift](/images/blog-list-makeswift.jpeg)

## Displaying Blog Post Content

Open the `/blog/[slug]/page.tsx` file. This is a [dynamic route](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) in Next.js. In this case, this means that this route will be used to dynamically generate individual pages for each blog post.

> You can find the final code for this section in `/blog/basic/[slug]/page.tsx`

Here, you need to query the appropriate blog post based on the dynamic `slug` property. To do this, first, you'll need to define the routes that will be generated by implementing `getStaticParams`.

```tsx
export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}
```

Next, you'll need to update the `Page` component to:

- retrieve the `slug` prop from `params`
- return `notFound()` if there isn't a slug
- query the blog post by the slug by calling `getBlog(slug)`
- return `notFound() if no blog post is found
- format the blog by calling `formatBlog()`
- display the blog content by using the `<BlogPostContent>` component

```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!slug) {
    return notFound()
  }

  const blogData = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogData.blogPostCollection) return notFound()

  if (!blog) return notFound()

  const formattedBlog = formatBlog(blog)

  return <BlogPostContent blogPost={formattedBlog} />
}
```

### View in Makeswift

To view an individual blog post, you'll need to add the page manually in Makeswift. Create a new page called **Purify Plants** with a `path` of `/blog/purify-plants`. Not that the second part of this path (after `/blog/`) should match the slug property as defined in Contentful.

After refreshing the page, you should see the blog post content.

![Blog post content page](/images/blog-post-content-no-breadcrumbs.jpeg)

### Displaying breadcrumbs

The `<BlogPostContent>` component from VIBES also includes the ability to display breadcrumbs. You can use this to provide quick links for the user to get back to the home page, the blog index page, etc.

To do this, you'll need to add a `breadcrumbs` array and pass it to the `<BlogPostContent>` component. The result should look like this.

```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
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
```

Now, you'll see a nice breadcrumbs navigation menu showing up.

![Blog post content page](/images/blog-post-content-breadcrumbs.jpeg)

## Custom Components in Makeswift

For a quick overview of how custom components are built with Makeswift, refer to the [Built-in components guide](https://docs.makeswift.com/developer/guides/how-to/built-in-components)

## Add Visually Editable CTA Section

So far, we're not taking advantage of any Makeswift features. We've simply integrated Contentful into a regular Next.js project and viewed the pages inside of Makeswift. Next, you'll update the blog post content page to display a section at the bottom of the post that can be edited in Makeswift. This will allow a user to visually add anything they'd like. For example a CTA, newsletter form, etc.

> The final code for this section can be found in `/blog/with-slot/[slug]/page.tsx`

For enabling components to be editable in Makeswift, you'll first need a regular React component. Then, you'll need to register that component with Makeswift. You can then use Makeswift controls to define properties that are visually editable by the user and then passed to the React component. These two files (the React component and registration file) are already included for you.

- `/components/BlogContentWithSlot/index.tsx`
- `/components/BlogContentWithSlot/BlogContentWithSlot.makeswift.tsx.tsx`

In the React component, you can see it's primary job is to render the blog post content as we've already been doing. In this case, it's accessing the blog post using the `useContentfulData` hook. This hook depends on the `<ContentfulProvider>` component which we'll add in a minute.

```tsx
const { data: blogs } = useContentfulData()
```

For the most part, the rest of this component looks exactly like what we had before where format the blog post, define breadcrumbs, and then pass those two props to the `<BlogPostContent>` component.

The one additional thing you'll see is that this component also accepts a `children` prop of type `React.ReactNode`. This is the prop that represents the content the user can add at the end of the blog post content.

In the `BlogContentWithSlot.makeswift.tsx.tsx` we can see how this works. Here, the component is registered with Makeswift. Inside of the `props` property, there is a property called `children` whose value is the [`Slot`](https://docs.makeswift.com/developer/reference/controls/slot) control from Makeswift. The Slot control basically enables a defined box that any type of content can be added to.

Often, the components that are registered with Makeswift are meant to be visually dragged and dropped from the Component Tray inside of Makeswift. However, in this case, we want to explicity render this component in our code. To do this, we need to use the [`<MakeswiftComponent>`](https://docs.makeswift.com/developer/reference/components/makeswift-component) API.

First, you need to get a "snapshot" of the component you want to do be rendered by calling `MakeswiftClient.getComponentSnapshot`. To this function you need to pass an id for the snapshot. In this case, use `'blog-content-with-slot'`. The second argument you need to pass is a configuration object that defines the `siteVersion`. The result looks like this.

```tsx
const componentSnapshot = await MakeswiftClient.getComponentSnapshot(`blog-content-with-slot`, {
  siteVersion: await getSiteVersion(),
})
```

Then, you'll need to render the snapshot using the `<MakeswiftComponent>` component. You'll pass the snapshot you just retrieved as well as a label. Lastly, you'll need to pass the `type` property which basically represents the unique identifier of the registered component to render. The `type` you will use is `BLOG_CONTENT_WITH_SLOT_TYPE` which is already imported. To render this component, it will look like this.

```tsx
<MakeswiftComponent
  snapshot={componentSnapshot}
  label="Blog Content with Slot"
  type={BLOG_CONTENT_WITH_SLOT_TYPE}
/>
```

Lastly, you'll need to wrap return value with the `<ContentfulProvider>` component like so:

```tsx
  return (
    <ContentfulProvider value={blogData.blogPostCollection?.items}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Content with Slot"
        type={BLOG_CONTENT_WITH_SLOT_TYPE}
      />
    </ContentfulProvider>
  )
```

The final result of this page looks like this:

```tsx
import { notFound } from 'next/navigation'

import { MakeswiftComponent } from '@makeswift/runtime/next'
import { getSiteVersion } from '@makeswift/runtime/next/server'

import { BLOG_CONTENT_WITH_SLOT_TYPE } from '@/components/BlogContentWithSlot/BlogContentWithSlot.makeswift'
import { GetBlogsDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { getAllBlogs, getBlog } from '@/lib/contentful/fetchers'
import { ContentfulProvider } from '@/lib/contentful/provider'
import { client as MakeswiftClient } from '@/lib/makeswift/client'

export async function generateStaticParams() {
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    `blog-content-with-slot-${slug}`,
    {
      siteVersion: await getSiteVersion(),
    }
  )

  if (componentSnapshot == null) return notFound()

  const blogData = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogData.blogPostCollection) return notFound()

  return (
    <ContentfulProvider value={blogData.blogPostCollection?.items}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Content with Slot"
        type={BLOG_CONTENT_WITH_SLOT_TYPE}
      />
    </ContentfulProvider>
  )
}
```

If you refresh the page in Makeswift and scroll to the bottom, you should see a gray box which represents the editable region.

![Blog post content with slot](/images/blog-post-content-with-slot.jpeg)

You can add anything you want. In this case, I'm going to add a text element and an instance of the **Email Form** component from the component tray. Here's what that looks like.

![Blog post content with email sign up CTA](/images/blog-post-content-with-email-cta.jpeg)

## Add Visually Editable CTA Section That is Different Per Page

What's really interesting about this CTA section is that it's going to show up the exact same on each individual blog post page. This is because the `id` that we defined when calling `getComponentSnapshot` is the same across each page. This means making a change to this section would affect all other blog post pages. This is nice if this is what you want, but you might also want the ability to customize the CTA for each blog post page.

To make the CTA section cutomizable for each page, you can simply pass a unique `id` to `getComponentSnapshot` for each different blog post page. You can do this by using string interpolation to add the `slug` of the give page to the `id` like so:

```tsx
const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
  `blog-content-with-slot-${slug}`,
  {
    siteVersion: await getSiteVersion(),
  }
)
```

Now, each component snapshot is going to be specific to the individual page it is referenced in.

## Make the Blog Content Page Fully Editable in Makeswift

So far, you've learned how to integrate Contentful into Next.js while making certain parts of a page editable in Makeswift. That works for most use cases, but there is another interesting use case. What if you wanted to visually customize the template of a blog post page from within Makeswift instead of in code? This would give you the ability to visually define the layout for blog post content and apply it to each blog post page.

Since you're integrating with Contentful for blog post data, you would need to have individual components for each property to visually layout your blog post content template. For a given blog post, we have different properties we want to display: title, author, body content, etc. These properties match to a few different model types in contentful: text, media, and rich text.

To solve this, you could create components specifically for each blog post property. However, what if you wanted something more general? Instead of a `ContentfulBlogPostTitle` component, what if you had components like `ContentfulText`, `ContentfulRichText`, `ContentfulImage` that could be connected to your individual fields, regardless of what their name is. Well, we've included a set of components like that under `/components/Contentful/common`.

To visually build your blog template, update the code in `/app/blog/page.tsx` to the following. This new code will:

```tsx
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
  const blogs = await getAllBlogs()
  return blogs.map(blog => ({ slug: blog?.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!slug) {
    return notFound()
  }

  const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
    'blog-content-customizable',
    {
      siteVersion: await getSiteVersion(),
    }
  )

  if (componentSnapshot == null) return notFound()

  const { blogPostCollection } = await client.request(GetBlogsDocument, {
    filter: { slug },
  })

  if (!blogPostCollection) return notFound()

  return (
    <ContentfulProvider value={blogPostCollection}>
      <MakeswiftComponent
        snapshot={componentSnapshot}
        label="Blog Post Customizable"
        type={BLOG_POST_EMBEDDED_COMPONENT_ID}
      />
    </ContentfulProvider>
  )
}
```

This main change here is that you are referencing a different component snapshot and `<MakeswiftComponent>`. Notice that the `id` for the snapshot is not unique per page. That's because we want this template to be used on each blog page.

Back in Makeswift, you should see your page is now empty with a slot to put whatever you want inside. From the Component Tray, you can drag instances of the those components from the `Contentful -> Blog` group of components. For each Contentful copmonent, you'll need to connect it to a specific property from your data. You can set this in the **Field** property in the properties sidebar. After you've successfully connected to the correct data field, you can customize your blog layout as you'd like.
