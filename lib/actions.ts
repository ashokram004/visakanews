'use server'

import { cookies } from 'next/headers'
import { updateFromStrapi } from './strapi'

export async function incrementView(id: number, documentId: string, currentViews: number, type: 'article' | 'profile') {
  const cookieStore = await cookies()
  const cookieName = type === 'article' ? 'viewed_articles' : 'viewed_profiles'
  const viewed = cookieStore.get(cookieName)?.value
  const viewedIds = viewed ? JSON.parse(viewed) : []

  if (!viewedIds.includes(id)) {
    try {
      const endpoint = type === 'article' ? `/articles/${documentId}` : `/profiles/${documentId}`
      await updateFromStrapi(endpoint, { data: { views: currentViews + 1 } })
      viewedIds.push(id)
      cookieStore.set(cookieName, JSON.stringify(viewedIds), { maxAge: 60 * 60 * 24 * 30 }) // 30 days
    } catch (error) {
      console.error('Failed to increment views:', error)
    }
  }
}
