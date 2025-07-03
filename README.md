# Makeswift + Contentful Integration

This integration demonstrates how to combine the power of Contentful's content management with Makeswift's visual page building capabilities. Build visually editable blog websites where content is managed in Contentful but layouts are designed in Makeswift.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.x or later
- [Makeswift](https://www.makeswift.com/) account (for visual page building) [Sign up for free](https://app.makeswift.com/signup)
- [Contentful](https://www.contentful.com/) account (for content management) [Sign up for free](https://www.contentful.com/sign-up)
- Basic familiarity with [Next.js App Router](https://nextjs.org/docs/app)

This guide assumes that you're familiar with Makeswift and setting up a custom host. Read here to learn more: https://docs.makeswift.com/developer/app-router/installation

## Project Structure

```
makeswift-contentful-workshop/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog-related routes
│   │   ├── [slug]/               # Dynamic blog post pages
│   │   └── page.tsx              # Blog index page
│   ├── api/makeswift/            # Makeswift API routes
│   ├── [[...path]]/              # Dynamic Makeswift routes
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── BlogContentWithSlot/      # Main blog component with slot
│   ├── Section/                  # Section components
│   └── Warning/                  # Error components
├── lib/                          # Utility functions and configs
│   ├── contentful/               # Contentful utilities
│   │   ├── queries/              # GraphQL queries
│   │   ├── client.ts             # GraphQL client
│   │   ├── fetchers.ts           # Data fetching functions
│   │   ├── provider.tsx          # React context provider
│   │   └── utils.ts              # Formatting utilities
│   └── makeswift/                # Makeswift configuration
├── generated/                    # Auto-generated TypeScript types
│   └── contentful.ts             # Contentful GraphQL types
├── vibes/soul/                   # Pre-built UI components
│   ├── primitives/               # Basic UI primitives
│   └── sections/                 # Layout sections
└── env.ts                        # Environment variable validation
```

## Quick Start

### 1. Clone the repository

```bash
   npx makeswift@latest init --example=contentful
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file and add your credentials:

```
MAKESWIFT_SITE_API_KEY=your_makeswift_api_key
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### 4. Set up your content model in Contentful

Create the following content types in your Contentful space:

**Author Content Type:**

- **Name\*** (Short text) - The author's name (mark as "Entry title")
- **Slug\*** (Short text) - URL-friendly identifier
- **Job Title** (Short text) - The author's job title
- **Description** (Rich text) - Author bio
- **Avatar** (Media) - Profile image

**BlogPost Content Type:**

- **Title\*** (Short text) - Post title (mark as "Entry title")
- **Description** (Long text) - Brief summary
- **Slug\*** (Short text) - URL-friendly identifier
- **Feed Date\*** (Date & time) - Publication date
- **Body** (Rich text) - Main content
- **Author** (Reference) - Reference to Author content type
- **Banner** (Media) - Hero image

Add sample content for both Authors and BlogPosts to test the integration.

### 5. Generate TypeScript types

```bash
pnpm run codegen-ts
```

This command watches for changes and regenerates types automatically.

### 6. Run the development server

```bash
pnpm dev
```

## Building Blog Pages in Makeswift

### Blog Index Page (`/blog`)

The blog index page displays a list of all blog posts and is implemented as a static Next.js page. To set it up in Makeswift:

1. In the Makeswift builder, create a new page with the path `/blog`
2. The page will automatically display your blog posts using the `BlogPostList` component from VIBES
3. Posts are automatically fetched from Contentful and formatted for display

### Individual Blog Post Pages (`/blog/[slug]`)

This integration uses a unique **BlogContentWithSlot** pattern that allows you to:

1. **Automatically generate pages** for each blog post based on the slug
2. **Display blog content** (title, date, content, etc.) from Contentful
3. **Add custom sections** visually in Makeswift below the blog content

#### Unique Component Snapshots

With this implementation, each blog post gets its own **unique component snapshot** in Makeswift using the pattern `blog-content-with-slot-${slug}`. This means:

- A blog post with slug `"my-first-post"` gets snapshot ID `"blog-content-with-slot-my-first-post"`
- A blog post with slug `"getting-started"` gets snapshot ID `"blog-content-with-slot-getting-started"`
- Each blog post has their own instance of registered controls thus allowing for each page to have their own information. In this case, we are registering an additional slot.

To further add to a blog post:

1. In Makeswift, navigate to any blog post URL (e.g., `/blog/your-post-slug`), or create a page with a matching path.
2. The first time you visit, you'll see the blog content with an empty slot below
3. Drag components from the Makeswift toolbar into the slot area
4. Your custom layout will be saved and applied **only to this specific blog post**
5. Other blog posts with different slugs will have their own independent layouts

## Key Integration Components

### Dynamic Page Generation with Unique Snapshots

This critical logic can be found in `app/blog/[slug]/page.tsx`:

```25:35:app/blog/[slug]/page.tsx
const componentSnapshot = await MakeswiftClient.getComponentSnapshot(
  `blog-content-with-slot-${slug}`, // Allows for unique versions of this component
  {
    siteVersion: await getSiteVersion(),
  }
)
```

This code demonstrates how:

- The `slug` parameter from the URL is used to create a unique snapshot identifier
- Each blog post gets its own saved layout in Makeswift (`blog-content-with-slot-${slug}`)
- Content is fetched from Contentful based on the same slug
- The combination creates unique, editable pages for each blog post

### BlogContentWithSlot

The main component that powers the blog post pages:

`components/BlogContentWithSlot/index.tsx`

## Development Guide

### Environment Configuration

Environment variables are validated using `@t3-oss/env-nextjs`:

```4:15:env.ts
export const env = createEnv({
  server: {
    MAKESWIFT_SITE_API_KEY: z.string().min(1),
    CONTENTFUL_ACCESS_TOKEN: z.string().min(1),
    CONTENTFUL_SPACE_ID: z.string().min(1),
  },
  runtimeEnv: {
    MAKESWIFT_SITE_API_KEY: process.env.MAKESWIFT_SITE_API_KEY,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
  },
})
```

### GraphQL Code Generation

Types are automatically generated from your Contentful schema. The configuration is in `graphql.config.ts` and types are output to `generated/contentful.ts`.

### VIBES Components

This project uses pre-built components from [VIBES](https://vibes.site/) for consistent, modern UI. See the [vibes folder](/vibes/README.md) for more details.

- **BlogPostList**: Displays a grid of blog post cards
- **BlogPostContent**: Shows individual blog post content with breadcrumbs
- **SectionLayout**: Provides consistent spacing and layout

### Content Formatting

Blog posts are transformed from Contentful's format to match VIBES component expectations:

`lib/contentful/utils.ts`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm codegen-ts` - Generate TypeScript types from Contentful schema (with watch mode)

## Troubleshooting

Common issues and solutions:

- **Type generation fails**
  - Ensure Contentful credentials are correct in `.env.local`
  - Check that your content model matches the GraphQL query
  - Verify content is published in Contentful

- **Blog posts not showing**
  - Verify the slug format matches your Contentful entries
  - Check if posts are published in Contentful
  - Ensure required fields (title, slug, feedDate, body, banner) are populated

- **Makeswift builder issues**
  - Clear browser cache and refresh
  - Ensure `MAKESWIFT_SITE_API_KEY` is correctly set
  - Verify your host URL is set to `http://localhost:3000/` in Makeswift settings

- **GraphQL errors**
  - Run `pnpm codegen-ts` to regenerate types
  - Check that your content model structure matches the GraphQL query
  - Ensure all referenced content types (Author, BlogPost) exist and are published

## Learn More

- [Makeswift Documentation](https://www.makeswift.com/docs/)
- [Makeswift Runtime GitHub repository](https://github.com/makeswift/makeswift)
- [Contentful GraphQL API Reference](https://www.contentful.com/developers/docs/references/graphql/)
- [VIBES Component Library](https://vibes.site/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
