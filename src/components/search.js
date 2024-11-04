'use client';
import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import styles from "@/styles/Movie.module.css"
import Genres from "@/components/genres"
import { Sidebar } from "@/components/card"
import Movie from "@/components/movie"
import Actor from "@/components/actor"
import YearPicker from "@/components/yearPicker"
import Spinner from "@/components/spinner"
import { useRouter } from 'next/router'
import clsx from 'clsx'



export const CallbackContext = createContext(null);

const NUM_MOVIES = 16

export default function Search({
  _tconst, _nconst, _name, _genres, _yearStart, _yearEnd, _query
}) {
  const router = useRouter()

  const [data, setData] = useState([])
  const [numMovies, setNumMovies] = useState(NUM_MOVIES)
  const [genres, setGenres] = useState()
  const [yearstart, setYearstart] = useState()
  const [yearend, setYearend] = useState()
  const [query, setQuery] = useState('undefined')
  const [tconst, setMovie] = useState()
  const [nconst, setActor] = useState()
  const [titletype, setTitletype] = useState('movie')
  const [actorName, setActorName] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [moviePageStyle, setMoviePageStyle] = useState({ "visibility": "hidden" })
  const [searchPageStyle, setSearchPageStyle] = useState({ "visibility": "visible" })

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const queryRef = useRef()

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
    if (result && !_query)
      snagActorName(result)
  }

  useEffect(() => {
    //return
    if (!router.isReady)
      return

    if (_tconst) {
      resetMovie(_tconst)
    }
    else {
      if (_nconst) {
        //resetActor(_nconst, _name)
        resetActor(_nconst)
      }
      if (_query) {
        // console.log("got a query", _query)
        resetQuery(_query)
      }
      if (_genres) {
        resetGenres(_genres)
      }
      if (_yearStart) {
        if (_yearEnd) {
          setMovie(null)
          setNumMovies(NUM_MOVIES)
          setYearstart(_yearStart)
          setYearend(_yearEnd)
        } else {
          resetYear(_yearStart)
        }
      }
    }
  }, [_tconst, _nconst, _query, _genres, _yearStart, _yearEnd])

  useEffect(() => {
    // console.log("useEffect, query:", _query, query)
    if (!router.isReady)
      return

    getData()
  }, [genres, numMovies, yearstart, yearend, query, nconst, titletype])

  if (!data) // || data.length == 0)
    return null

  const isBottom = (el) => {
    console.log(`scrollTop:${el.scrollTop}, clientHeight:${el.clientHeight}, scrollHeight:${el.scrollHeight}`)
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
    }, 100); // Adjust the delay as needed

    const el = e.nativeEvent.srcElement
    if (isBottom(el)) {
      //document.getElementsByTagName('html')[0].className += " wait";
      setNumMovies(numMovies + NUM_MOVIES)
    }
  }

  const updateDates = (yearstart, yearend) => {
    const start = document.getElementById('yearstart')
    start.defaultValue = yearstart
    const end = document.getElementById('yearend')
    end.defaultValue = yearend
    setYearstart(yearstart)
    setYearend(yearend)
  }

  const goLeft = (e) => {
    if (!yearstart || !yearend)
      return

    const delta = Math.max(yearend - yearstart, 1)
    updateDates(parseInt(yearstart) - delta, parseInt(yearend) - delta)
  }

  const goRight = (e) => {
    if (!yearstart || !yearend)
      return

    const delta = Math.max(yearend - yearstart, 1)
    updateDates(parseInt(yearstart) + delta, parseInt(yearend) + delta)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const text = event.target.value
      console.log('Text submitted:', text);
      setQuery(text)
      event.preventDefault();
    }
  }

  const resetGenres = (genres) => {
    setMovie(null)
    setNumMovies(NUM_MOVIES)

    setGenres(genres)
    setSearchPageStyle({ "visibility": "visible" })
    setMoviePageStyle({ "visibility": "hidden" })
  }

  const resetYear = (year) => {
    resetMovie(null)
    setNumMovies(NUM_MOVIES)

    console.log('tconst', tconst)
    setYearstart(year)
    setYearend(year)
  }

  const resetMovie = (tconst) => {
    setMovie(tconst)

    if (tconst) {
      setMoviePageStyle({ "visibility": "visible" })
    } else {
      if (data.length == 0)
        // A tconst param was provided, and then from the Movie page the user clicked close.
        // On startup, we switched to Movie mode before Search could be populated.
        // So we need to read some data now.
        getData()

      setSearchPageStyle({ "visibility": "visible" })
      setMoviePageStyle({ "visibility": "hidden" })
    }
  }

  const resetQuery = (query) => {
    setMovie(null)
    setNumMovies(NUM_MOVIES)
    setQuery(query)
  }

  const resetActor = (_nconst) => {
    // toggle
    const newNconst = _nconst == nconst
      ? null
      : _nconst

    setMovie(null)
    setQuery(null)
    setGenres(null)
    setNumMovies(NUM_MOVIES)

    if (queryRef.current)
      queryRef.current.value = ''
    setActor(newNconst)
    if (!newNconst)
      setActorName('')
  }

  const handleOnChange = (e) => {
    const value = e.target.value
    if (value == '')
      resetQuery(null)
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
        params.push(`yearStart=${yearstart}`)
      }
      if (yearend) {
        params.push(`yearEnd=${yearend}`)
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

  const callbacks = {
    resetGenres: resetGenres,
    resetYear: resetYear,
    resetQuery: resetQuery,
    resetMovie: resetMovie,
    resetActor: resetActor
  }

  setNavUrl()

  const Banner = () => {
    return <div className={styles.banner} onScroll={(e) => console.log("scrolling from banner")}>
      Superficial
      {actorName}
      {yearstart} to{yearend}
      {genres}
      {query}
    </div>
  }

  const ControlPanel = ( {searchPageStyle }) => {
    return <div className={styles.controls} style={searchPageStyle}>
      <div className={styles.page_title}>
        Superficial
      </div>
      <div className={styles.page_subtitle}>
        the impossible streaming service
      </div>
      <div>
        <label>
          <input
            name='titletype'
            type="radio"
            defaultChecked={titletype == 'movie'}
            onChange={
              (e) => {
                if (e.target.checked) setTitletype('movie')
              }
            } />
          movie
        </label>
        &nbsp;

        <label>
          <input name='titletype' type="radio"
            defaultChecked={titletype == 'tvSeries'}
            onChange={
              (e) => {
                if (e.target.checked) setTitletype('tvSeries')
              }
            } />
          tv
        </label>


      </div>
      <div>
        <input
          id="query"
          ref={queryRef}
          className={styles.search_input}
          type="search"
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
          size="25"
          defaultValue={query != 'undefined' ? query : null}
          placeholder='search movies and actors' />
      </div>
      <div className={styles.date_widget}>

        <YearPicker
          setParentYearstart={setYearstart}
          setParentYearend={setYearend}
          goLeft={goLeft}
          goRight={goRight}
          _yearstart={yearstart}
          _yearend={yearend} />
      </div>


      <Actor nconst={nconst} actorName={actorName} resetActor={resetActor} />

      <div>
        <Genres
          genres={genres}
          query={query}
          yearstart={yearstart}
          yearend={yearend}
          nconst={nconst}
          titletype={titletype}
        />
      </div>

    </div>
  }


  const SearchResults = ({ searchPageStyle, data, nconst, isScrolling }) => {
    return <div
      className={styles.search_results}
      style={searchPageStyle}
      onScroll={onScroll}

    >
      <Sidebar
        data={data}
        place='genres'
        selectedPerson={nconst}
        isScrolling={isScrolling}
      />
    </div>
  }

  // isScrolling={isScrolling} 

  //       <Spinner isLoading={isLoading} />
  //       <SearchResults />

  return <CallbackContext.Provider value={callbacks}>

   <Spinner isLoading={isLoading} />

    <Movie
      tconst={tconst}
      moviePageStyle={moviePageStyle}
      setMoviePageStyle={setMoviePageStyle}
      setSearchPageStyle={setSearchPageStyle} />

    <div
      className={styles.search_results}
      style={searchPageStyle}
      onScroll={onScroll}
    >
      <Sidebar
        data={data}
        place='genres'
        selectedPerson={nconst}
        isScrolling={isScrolling}
      />
    </div>

    <ControlPanel 
      searchPageStyle= {searchPageStyle}
    />

  </CallbackContext.Provider >
}

