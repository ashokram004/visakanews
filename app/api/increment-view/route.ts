import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateFromStrapi } from '../../../lib/strapi'

export async function POST(request: NextRequest) {
  try {
    const { id, documentId, currentViews, type } = await request.json()

    const cookieStore = await cookies()
    const cookieName = type === 'article' ? 'viewed_articles' : 'viewed_profiles'
    const viewed = cookieStore.get(cookieName)?.value
    const viewedIds = viewed ? JSON.parse(viewed) : []

    if (!viewedIds.includes(id)) {
      const endpoint = type === 'article' ? `/articles/${documentId}` : `/profiles/${documentId}`
      await updateFromStrapi(endpoint, { data: { views: currentViews + 1 } })
      viewedIds.push(id)
      cookieStore.set(cookieName, JSON.stringify(viewedIds)) // Session cookie
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to increment views:', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}
