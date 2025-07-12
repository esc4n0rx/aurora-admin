// app/api/tmdb/details/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { tmdbApi } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    if (!id || !type) {
      return NextResponse.json(
        { success: false, message: 'ID and type parameters are required' },
        { status: 400 }
      )
    }

    const tmdbId = parseInt(id)
    if (isNaN(tmdbId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID parameter' },
        { status: 400 }
      )
    }

    let details
    let credits
    
    if (type === 'movie') {
      details = await tmdbApi.getMovieDetails(tmdbId)
      credits = await tmdbApi.getMovieCredits(tmdbId)
    } else if (type === 'tv') {
      details = await tmdbApi.getTVDetails(tmdbId)
      credits = await tmdbApi.getTVCredits(tmdbId)
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid type parameter. Must be "movie" or "tv"' },
        { status: 400 }
      )
    }

    // Adicionar informações de créditos aos detalhes
    const director = credits.crew.find(person => person.job === 'Director')?.name
    const cast = credits.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 10)
      .map(actor => actor.name)

    const enrichedDetails = {
      ...details,
      director,
      cast,
    }

    return NextResponse.json({
      success: true,
      data: enrichedDetails,
    })
  } catch (error) {
    console.error('TMDB details error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}