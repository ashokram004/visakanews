'use client'

import { useEffect, useRef } from 'react'

interface ViewIncrementorProps {
  id: number
  documentId: string
  currentViews: number
  type: 'article' | 'profile'
}

export default function ViewIncrementor({ id, documentId, currentViews, type }: ViewIncrementorProps) {
  const hasIncrementedRef = useRef(false)

  useEffect(() => {
    if (hasIncrementedRef.current) return

    const cookieName = type === 'article' ? 'viewed_articles' : 'viewed_profiles'
    const viewed = document.cookie.split('; ').find(row => row.startsWith(`${cookieName}=`))?.split('=')[1]
    const viewedIds = viewed ? JSON.parse(decodeURIComponent(viewed)) : []

    if (!viewedIds.includes(id)) {
      hasIncrementedRef.current = true
      fetch('/api/increment-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          documentId,
          currentViews,
          type
        })
      }).catch(error => console.error('Failed to increment views:', error))
    }
  }, [id, documentId, currentViews, type])

  return null
}
