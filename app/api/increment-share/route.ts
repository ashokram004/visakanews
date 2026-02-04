import { NextRequest, NextResponse } from 'next/server'
import { updateFromStrapi } from '../../../lib/strapi'

export async function POST(request: NextRequest) {
  try {
    const { documentId, currentShares, type } = await request.json()

    const endpoint = type === 'article' ? `/articles/${documentId}` : `/profiles/${documentId}`
    await updateFromStrapi(endpoint, { data: { shares: currentShares + 1 } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to increment shares:', error)
    return NextResponse.json({ error: 'Failed to increment shares' }, { status: 500 })
  }
}
