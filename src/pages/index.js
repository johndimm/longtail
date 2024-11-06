//'use client';
import { useEffect, useState } from 'react'
import Search from "@/components/search"
import { useRouter } from 'next/router'
import { CallbackContext } from '@/components/search'

export default function Index() {
  const router = useRouter()

  const [_genres, setGenres] = useState()
  const [_yearstart, setYearstart] = useState()
  const [_yearend, setYearend] = useState()
  const [_query, setQuery] = useState('undefined')
  const [_tconst, setMovie] = useState()
  const [_nconst, setActor] = useState()
  const [_titletype, setTitletype] = useState('movie')

  const { tconst, nconst, genres, year, yearstart, yearend, query, titletype } = router.query

  useEffect(() => {
    setMovie(tconst)
    setActor(nconst)
    setGenres(genres)
    setYearstart(yearstart || year)
    setYearend(yearend || year)
    setQuery(query)
    setTitletype(titletype)
    console.log("index setTitletype to ", titletype)
  }, [tconst, nconst, genres, year, yearstart, yearend, query, titletype])


  const resetGenres = (genres) => {
    setMovie(null)
    setGenres(genres)
  }

  const resetYear = (year) => {
    resetMovie(null)
    setYearstart(year)
    setYearend(year)
  }

  const resetMovie = (tconst) => {
    setMovie(tconst)
  }

  const resetQuery = (query) => {
    setMovie(null)
    setQuery(query)
  }

  const resetActor = (nconst) => {
    // toggle
    const newNconst = _nconst == nconst
      ? null
      : nconst

    setMovie(null)
    setQuery(null)
    setGenres(null)
    setActor(newNconst)
  }

  const callbacks = {
    resetGenres: resetGenres,
    resetYear: resetYear,
    setYearstart: setYearstart,
    setYearend: setYearend,
    resetQuery: resetQuery,
    resetMovie: resetMovie,
    resetActor: resetActor,
    setTitletype: setTitletype
  }

  if (!router.isReady || _titletype == null) {
    return null
  }

  return <CallbackContext.Provider value={callbacks}>

    <Search
      tconst={_tconst}
      nconst={_nconst}
      genres={_genres}
      yearstart={_yearstart}
      yearend={_yearend}
      query={_query}
      titletype={_titletype} />

  </CallbackContext.Provider >
}
