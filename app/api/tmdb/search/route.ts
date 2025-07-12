// app/api/tmdb/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { tmdbApi } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'multi'
    const page = parseInt(searchParams.get('page') || '1')

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Query parameter is required' },
        { status: 400 }
      )
    }

    let results
    switch (type) {
      case 'movie':
        results = await tmdbApi.searchMovies(query, page)
        break
      case 'tv':
        results = await tmdbApi.searchTV(query, page)
        break
      default:
        results = await tmdbApi.searchMulti(query, page)
    }

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}