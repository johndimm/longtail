import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import styles from "@/styles/Movie.module.css"
import { Sidebar } from "@/components/card"
import Movie from "@/components/movie"
import Spinner from "@/components/spinner"
import { useRouter } from 'next/router'
import ControlPanel from "@/components/controlPanel"

export const CallbackContext = createContext(null);
const NUM_MOVIES = 24

export default function Search({
  tconst, nconst, genres, yearstart, yearend, query, titletype
}) {
  const router = useRouter()

  const [data, setData] = useState([])
  const [numMovies, setNumMovies] = useState(NUM_MOVIES)

  const [actorName, setActorName] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [moviePageStyle, setMoviePageStyle] = useState({ "visibility": "hidden" })
  const [searchPageStyle, setSearchPageStyle] = useState({ "visibility": "visible" })

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie, resetActor, resetQuery, setYearstart, setYearend, setTitletype } = callbacks

  const snagActorName = (result) => {
    // Get selected actor name after we have some data.
    let found = false
    for (let i = 0; i < result.length && !found; i++) {
      const _nconst = result[i]["nconst"]
      if (nconst && nconst == _nconst) {
        const name = result[i]["primaryname"]
        setActorName(name)
        found = true
      }
    }
  }

  const getData = async () => {
    const url = `/api/get_movies?genres=${genres}&yearstart=${yearstart}&yearend=${yearend}&numMovies=${numMovies}&query=${query}&nconst=${nconst}&titletype=${titletype}`
    // console.log(url)

    setIsLoading(true)
    const response = await fetch(url)
    const result = await response.json()
    setIsLoading(false)

    setData(result)
    if (result && !query)
      snagActorName(result)
  }

  useEffect(() => {
    if (tconst)
      setupMoviePage()
    else
      setupSearchPage()
  }, [tconst])

  useEffect(() => {
    if (!nconst)
      setActorName('')
  }, [nconst])

  useEffect(() => {
    // console.log("useEffect, query:", _query, query)
    if (!router.isReady)
      return

    getData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [genres, numMovies, yearstart, yearend, query, nconst, titletype])

  if (!data) // || data.length == 0)
    return null

  const isBottom = (el) => {
    // console.log(`scrollTop:${el.scrollTop}, clientHeight:${el.clientHeight}, scrollHeight:${el.scrollHeight}`)
    return el.scrollTop + el.clientHeight + 1 > el.scrollHeight
  }

  const onScroll = (e) => {
    e.preventDefault()
    // return
    console.log("onScroll")
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 100);

    const el = e.nativeEvent.srcElement
    if (isBottom(el)) {
      setNumMovies(numMovies + NUM_MOVIES)
    }
  }

  const setupSearchPage = () => {

    setSearchPageStyle({ "display": "block" })
    setMoviePageStyle({ "display": "none" })
  }

  const setupMoviePage = () => {
    setMoviePageStyle({ "display": "block" })
    // SearchPage will be hidden when the Movie page is ready.
    // hideSearchPage()
  }

  const hideSearchPage = () => {
    setSearchPageStyle({ "display": "none" })
  }

  const setNavUrl = () => {
    let navUrl = ''
    if (tconst) {
      navUrl = `/?tconst=${tconst}`
    } else {
      let params = []
      if (nconst) {
        params.push(`nconst=${nconst}`)
      }
      if (query && query != 'undefined') {
        params.push(`query=${query}`)
      }
      if (genres) {
        params.push(`genres=${genres}`)
      }
      if (yearstart) {
        params.push(`yearstart=${yearstart}`)
      }
      if (yearend) {
        params.push(`yearend=${yearend}`)
      }
      if (titletype) {
        params.push(`titletype=${titletype}`)
      }
      if (params.length > 0) {
        const p = params.join('&')
        navUrl = `/?${p}`
      }
    }
    if (typeof window !== 'undefined') {
      // console.log("setNavUrl", navUrl)
      window.history.pushState({}, '', navUrl);
    }
  }

  const searchResultsHTML = (
    <div
      className={styles.search_results}
      style={searchPageStyle}
      onScroll={onScroll}
    >
      <ControlPanel
        nconst={nconst}
        tconst={tconst}
        genres={genres}
        yearstart={yearstart}
        yearend={yearend}
        query={query}
        titletype={titletype}
        setNumMovies={setNumMovies}
        actorName={actorName}
      />
      <Sidebar
        data={data}
        place='genres'
        selectedPerson={nconst}
        isScrolling={isScrolling}
      />
    </div>
  )

  const movieHTML = (
    <div
      className={styles.movie}
      style={moviePageStyle}
    >
      <Movie
        tconst={tconst}
        hideSearchPage={hideSearchPage}
      />
    </div>
  )

  setNavUrl()

  return <>
    <Spinner isLoading={isLoading} />
    {movieHTML}
    {searchResultsHTML}
  </>
}

/*

<SearchResults 
searchPageStyle={searchPageStyle} 
data={data}
nconst={nconst}
isScrolling={isScrolling}
/>

*/