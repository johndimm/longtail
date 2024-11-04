import React, { useState, useEffect } from 'react'
import styles from "@/styles/Movie.module.css"

const Actor = ({ nconst, actorName, resetActor }) => {
    // return <></>
    const [data, setData] = useState([])
  
    const getActor = async (nconst) => {
      const url = `/api/get_actor/${nconst}`
      const response = await fetch(url)
      const data = await response.json()
      setData(data)
    }
  
    useEffect(() => {
      if (nconst)
        getActor(nconst)
    }, [nconst])
  
    if (!data)
      return null
  
    const width = 200
    const url_prefix = `https://image.tmdb.org/t/p/w${width}`
    const profilePicture = data.hasOwnProperty("profile_path") 
      && nconst
      && data["profile_path"] != null
      ? <img src={url_prefix + data["profile_path"]} />
      : <></>
  
    const imgUrl = `https://www.imdb.com/name/${nconst}`
    // console.log('imgUrl', imgUrl)
  
    const imdbLink = nconst
      ? <a title="person in imdb" target='_imdb' href={imgUrl}>&#128100;</a>
      : <></>
  
    return <div className={styles.selected_actor}>
      <div onClick={(e) => resetActor(nconst)}>
        {profilePicture}
        <div>
        {actorName}
        </div>
      </div>
      {imdbLink}
  
    </div>
  }

  export default Actor