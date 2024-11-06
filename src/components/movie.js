import React, { useState, useEffect, useContext } from 'react'
import styles from "@/styles/Movie.module.css"
import { Card, Sidebar } from "./card"
import { CallbackContext } from '@/components/search'
import Spinner from "@/components/spinner"

const Trailer = ({ tmdb_id, titletype }) => {
  const [data, setData] = useState([])

  const getTrailers = async (tmdb_id, titletype) => {
    if (!tmdb_id || tmdb_id == -1) {
      setData(null)
    } else
      if (tmdb_id) {
        const url = `/api/get_trailers/${tmdb_id}/${titletype}`
        console.log(url)
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      }
  }

  useEffect(() => {
    getTrailers(tmdb_id, titletype)
  }, [tmdb_id])

  const youtube_embed = (key, name) => {
    const src = `https://www.youtube.com/embed/${key}`
    return <iframe width="100%" height="200px"
      src={src}
      title={name}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"

      mozallowfullscreen="mozallowfullscreen"
      msallowfullscreen="msallowfullscreen"
      oallowfullscreen="oallowfullscreen"
      webkitallowfullscreen="webkitallowfullscreen"

      controls="1"
    >
    </iframe>

  }

  let trailers
  if (data) {
    trailers = data.map((trailer, idx) => {
      return <div key={idx}>{youtube_embed(trailer.key, trailer.name)}</div>
    })
  }

  return <div className={styles.trailers}>{trailers}</div>

}

const Movie = ({
  tconst,
  hideSearchPage
}) => {
  const [data, setData] = useState([])
  const [nconst, setNconst] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const callbacks = useContext(CallbackContext)
  const { resetGenres, resetYear, resetMovie } = callbacks

  // console.log(tconst)

  const getData = async () => {
    setIsLoading(true)
    const url = `/api/get_movie/${tconst}`
    const response = await fetch(url)
    const result = await response.json()
    setData(result)
    setIsLoading(false)

    if (tconst)
      hideSearchPage()
  }

  useEffect(() => {
    getData()
    //    if (tconst)
    //      window.history.pushState({}, '', "?tconst=" + tconst);
  }, [tconst])

  const center_persons = data.filter(r => r.place == 'center')
  const center = <Card
    recs={center_persons}
    selectedPerson={nconst}
  />

  let tmdb_id
  let titletype
  if (center_persons.length > 0) {
    tmdb_id = center_persons[0].tmdb_id
    titletype = center_persons[0].titletype
  }

  if (!data || data.length == 0)
    return <Spinner isLoading={isLoading}/>

  return <div className={styles.movie_page}>
    <Spinner isLoading={isLoading} />

    <div className={styles.controls} style={{ "marginTop": "10px" }}>

<span className={styles.page_title}>
  Long Tail


  <span className={styles.page_subtitle}>productions by members of this cast and crew before and after</span>


  <span className={styles.close_button} title="go back" style={{ "cursor": "pointer" }} onClick={() => resetMovie(null)}>
    X
  </span>

</span>
</div>

    <div className={styles.left}>
      <Sidebar
        data={data}
        place='left'
        selectedPerson={nconst}
      />
    </div>

    <div className={styles.center}>
      {center}
      <Trailer tmdb_id={tmdb_id} titletype={titletype} />
    </div>

    <div className={styles.right}>
      <Sidebar
        data={data}
        place='right'
        selectedPerson={nconst} />
    </div>

  </div>
}

export default Movie
