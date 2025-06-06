import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document } from '@contentful/rich-text-types'

import { Asset, BlogPostBodyLinks, TypeFragment, TypesDocument } from '@/generated/contentful'
import { client } from '@/lib/contentful/client'
import { useContentfulData } from '@/lib/contentful/provider'
import { BlogPost } from '@/vibes/soul/primitives/blog-post-card'

import { QueriedBlogPost } from './fetchers'

type FieldPath = { label: string; path: string; type?: string | null }

export type ResolvedField = { data: unknown } | { error: string }

const isRichTextField = (fieldType: TypeFragment) =>
  fieldType.fields?.find(f => f.name === 'json') && fieldType.fields?.find(f => f.name === 'links')

export const isRichText = (field: any): field is { json: Document; links: BlogPostBodyLinks } =>
  field?.json?.nodeType === 'document'

export const isAsset = (field: any): field is Asset => {
  return field?.__typename === 'Asset'
}

function flattenFields(
  root: TypeFragment,
  fields: FieldPath[] = [],
  path: string[] = []
): FieldPath[] {
  if (!root.fields) return fields

  root.fields.forEach(field => {
    const newPath = [...path, field.name]

    fields.push({
      label: [field.name, ...path.slice().reverse()].join(' < '),
      path: newPath.join('.'),
      type: isRichTextField(field.type) ? 'RichText' : field.type.name,
    })

    flattenFields(field.type, fields, newPath)
  })

  return fields
}

export async function getFieldOptions({
  type,
  filter,
  query,
}: {
  type: 'BlogPost'
  filter?: (type?: string | null) => boolean
  query: string
}): Promise<{ id: string; label: string; value: string }[]> {
  const data = await client.request(TypesDocument, { name: type })

  if (!data.__type) return []

  return flattenFields(data.__type)
    .filter(field => (filter ? filter(field.type) : true))
    .filter(field => field.label.toLowerCase().includes(query.toLowerCase()))
    .map(field => ({ id: field.path, label: field.label, value: field.path }))
}

export function resolvePath<T extends string>(
  path: string | Array<T>,
  obj?: { [key: string]: any } | null,
  separator: string = '.'
): any {
  const properties = Array.isArray(path) ? path : path.split(separator)

  return properties.reduce((prev, curr) => prev?.[curr], obj ?? {})
}

export function useEntryField({ fieldPath }: { fieldPath?: string }): ResolvedField {
  const { data, error } = useContentfulData()
  console.log(data)

  if (error) return { error: 'No entry found.' }

  if (!fieldPath) return { error: 'Field path is not set.' }

  const field = resolvePath(fieldPath, data)

  if (!field) return { error: `Cannot find field at ${fieldPath}. Check the graphql query.` }

  return { data: field }
}

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
