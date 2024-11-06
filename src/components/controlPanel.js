
import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import { CallbackContext } from '@/components/search'
import Actor from "@/components/actor"
import YearPicker from "@/components/yearPicker"
import Genres from "@/components/genres"
import styles from "@/styles/Movie.module.css"

const ControlPanel = ({ nconst, actorName, titletype, genres, query, yearstart, yearend, setNumMovies }) => {

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie, resetActor, resetQuery, setYearstart, setYearend, setTitletype } = callbacks

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

      resetQuery(text)
      setNumMovies(NUM_MOVIES)
      event.preventDefault();
    }
  }

  const handleOnChange = (e) => {
    const value = e.target.value
    if (value == '')
      resetQuery(null)
  }


  return <div className={styles.controls}>

    <div className={styles.widget}>
      <Actor nconst={nconst} actorName={actorName} resetActor={resetActor} />
    </div>

    <div className={styles.widget}>
      <div className={styles.page_title}>
        Long Tail
      </div>
      <div className={styles.page_subtitle}>
        the fantasy streaming service
        <br />
        with
        <br />
        <b>
          "everything ever made"
        </b>
      </div>

      <div className={styles.movie_tv_switch}>
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
          movies
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
    </div>

    <div className={styles.widget}>
      <Genres
        genres={genres}
        query={query}
        yearstart={yearstart}
        yearend={yearend}
        nconst={nconst}
        titletype={titletype}
      />
    </div>

    <div className={styles.date_widget}>

      <YearPicker
        setParentYearstart={setYearstart}
        setParentYearend={setYearend}
        goLeft={goLeft}
        goRight={goRight}
        _yearstart={yearstart}
        _yearend={yearend} />

      <hr />

      <input
        id="query"
        className={styles.search_input}
        type="search"
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        size="28"
        defaultValue={query != 'undefined' ? query : null}
        placeholder='search title, cast, and crew' />
    </div>
  </div>
}

export default ControlPanel