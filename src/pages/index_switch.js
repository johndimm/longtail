import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import Movie from "@/components/movie"
import Search from "@/components/search"

export default function Home() {
  const router = useRouter()
  const { tconst, genres, year } = router.query

  const [selectedComponent, setSelectedComponent] = useState('genres')
  const [selectedTconst, setSelectedTconst] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)

  useEffect(() => {
    if (tconst) {
      setSelectedComponent('movie')
      setSelectedTconst(tconst)
    }
    if (genres) {
      setSelectedComponent('genres')
      setSelectedGenres(genres)
    }
    if (year) {
      setSelectedComponent('year')
      setSelectedYear(year)
    }
  }, [tconst, genres, year])

  const switchComponent = (component, value) => {
    setSelectedComponent(component)
    if (component == 'movie')
      setSelectedTconst(value)
    else if (component == 'genres')
      setSelectedGenres(value)
    else if (component == 'year')
      setSelectedYear(value)
  }

  if (selectedComponent == 'movie')
    return <Movie
      _tconst={selectedTconst}
      switchComponent={switchComponent} />

  else if (selectedComponent == 'genres') {
    const g = selectedGenres ? selectedGenres : 'undefined'
    return <Search
      genres={selectedGenres}
      switchComponent={switchComponent} />
  }
  
  else if (selectedComponent == 'year')
    return <Search
      year={selectedYear}
      switchComponent={switchComponent} />

  return null
}