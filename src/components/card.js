'useclient'
import { useContext, useState, useEffect, useRef } from 'react'
import Image from 'next/image';
import styles from "@/styles/Movie.module.css";
import { CallbackContext } from '@/components/search'
import clsx from 'clsx'


const StarRating = ({ score }) => {
  const filledStars = Math.round(score / 2.5);

  const stars = Array.from({ length: filledStars }, (v, i) => (
    <span key={i}>&#9733;</span>
  ));

  return <span className={styles.star_rating}>{stars}</span>
}

const deletePoster = (tconst) => {
  console.log("deleting failed poster from ", tconst)
  const url = `/api/delete_poster/${tconst}`
  const response = fetch(url)
}

const Person = ({ r, selectedPerson, resetActor }) => {
  const age = r.age ? `(${r.age})` : ''
  const roleStyle = r.role.indexOf('[') != -1
    ? { "fontStyle": "italic" }
    : { "fontStyle": "normal" }
  const role = r.role.replace(/\[/g, '').replace(/\]/g, '').replace(/_/g, ' ')

  const style = r.nconst == selectedPerson
    ? { "color": "red" }
    : null

  return <div className={styles.person}>
    <div
      className={styles.person_name}
      style={style}
      onClick={() => {
        // setPerson(r.nconst); 
        resetActor(r.nconst, r.primaryname);
      }}>
      {r.primaryname}
      <span className={styles.age}>{age}</span>
    </div>
    <div className={styles.role} style={roleStyle}>{role}</div>
  </div>
}

export const Card = ({
  recs,
  selectedPerson,
  isScrolling
}) => {
  const [topClass, setTopClass] = useState(clsx(styles.card, styles.card_black))
  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie, resetActor } = callbacks


  useEffect(() => {
    if (recs && recs.length > 0) {
      const poster_url = recs[0].poster_url
      if (!poster_url || poster_url.length == 0) {
        // console.log("useEffect", poster_url)
        setTopClass(clsx(styles.card, styles.card_white))
      }
    }
  }, [recs])

  if (!recs || recs.length == 0)
    return null

  const r1 = recs[0]

  let slicedRecs = recs
  if (r1.place == 'genres') {
    slicedRecs = recs.slice(0, 4)
  }

  const persons = slicedRecs.map((rec, idx) => {
    return <Person
      key={idx}
      r={rec}
      selectedPerson={selectedPerson}
      resetActor={resetActor} />
  })

  const genres = r1.genres ? r1.genres.replace(/,/g, ', ') : ''

  const goToMovie = () => {
    resetMovie(r1.tconst)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let poster = null
  if (r1.poster_url && r1.poster_url != '') {
    const poster_url = r1.poster_url.replace('w200', 'w400')
    poster = <img
      src={poster_url}
      onClick={goToMovie}
      onLoad={(e) => {
        e.target.style.display = 'inline-block'
      }}
      onError={(e) => {
        console.log('cover image load error for', r1.primaryTitle)
        deletePoster(r1.tconst)
        e.target.style.display = 'none'
      }} />
  }

  const center_poster = r1.place == 'center'
    ? poster
    : null

  const right_poster = r1.place == 'center'
    ? null
    : poster

  const icon = r1.titletype == 'movie'
    ? <>&#127909;</>
    : <>&#128250;</>

  const title = r1.primarytitle.length < 30
    ? <>{r1.primarytitle}</>
    : <span style={{ "display": "flex", "fontSize": "70%", "lineHeight": "1.2", "flexWrap": 'wrap', }}>{r1.primarytitle}</span>
  1
  let plot_sentence = r1.plot_summary
  if (r1.place == 'genres')
    plot_sentence = r1.plot_summary ? r1.plot_summary + '...' : ''

  const enterCard = (e) => {
    //setTimeout ( () => 
    if (!isScrolling)
      setTopClass(clsx(styles.card, styles.card_white))
    //, 500)
  }

  const leaveCard = (e) => {
    // return
    //console.log("leaveCard1", r1.poster_url)  
    if (r1.poster_url && r1.poster_url != '') {
      //console.log("leaveCard2", r1.poster_url)
      setTopClass(clsx(styles.card, styles.card_black))
    }
  }

  return <div className={topClass}
    onMouseEnter={enterCard}
    onMouseLeave={leaveCard}
  >

    <div className={styles.card_text}>

      <div>
        <div onClick={goToMovie}>
          <div className={styles.movie_title}>
            {title}
          </div>

          <hr />
          {center_poster}
          <div className={styles.plot_summary}>
            {plot_sentence}
          </div>
        </div>

        <div className={styles.persons}>
          {persons}
        </div>

      </div>


      <div className={styles.metadata}>
        <StarRating score={r1.averagerating} />

        <span
          className={styles.year}
          title='Show only movies between start and end years'
          onClick={() => resetYear(r1.startyear)}>
          {r1.startyear}
        </span>
        <span>
          <a target="_imdb" title={`${r1.titletype} in imdb`}
            href={`https://www.imdb.com/title/${r1.tconst}/`}>{icon}</a>
        </span>
        <br />
        <span
          className={styles.genres}
          title='Set the genres'
          onClick={() => resetGenres(r1.genres)}>
          {genres}
        </span>
      </div>


    </div>

    {right_poster}
  </div>
}

export const Sidebar = ({
  data,
  place,
  selectedPerson,
  isScrolling
}) => {

  // Aggregate multiple actors in the same film.
  const agg = {}
  data.filter(r => r.place == place).forEach((r, idx) => {
    const movie = r.tconst
    if (!(movie in agg)) {
      agg[movie] = []
    }
    agg[movie].push(r)
  })

  return Object.keys(agg).map((tconst, idx) => {
    const recs = agg[tconst]
    //if (!selectedPerson || recs.find((r) => r.nconst == selectedPerson)) {
    return <Card
      key={idx}
      recs={recs}
      selectedPerson={selectedPerson}
      position="sidebar" 
      isScrolling={isScrolling}/>
    //} else {
    //  return null
    //}
  })
}