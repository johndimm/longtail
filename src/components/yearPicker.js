
import React, { useState, useRef, useEffect } from 'react'
import styles from "@/styles/Movie.module.css"

const YearPicker = ({
  setParentYearstart, setParentYearend, _yearstart, _yearend, goLeft, goRight
}) => {
  const [state, setState] = useState(0)
  // const [key, setKey] = useState(1)
  const [yearstart, setYearstart] = useState(_yearstart || '')
  const [yearend, setYearend] = useState(_yearend || '')

  //const yearstartRef = useRef()
  //const yearendRef = useRef()

  const N = 135
  const MIN_DATE = 1890

  useEffect(() => {
    if (_yearstart) {
      setState(2)
      setYearstart(_yearstart)
    }

    if (_yearend) {
      setYearend(_yearend)
    }
  }, [_yearstart, _yearend])

  const setYear = (year) => {
    if (state == 2 && yearstart == '') {
      setState(0)
    }

    if (state == 0) {
      setYearstart(year)
    } else if (state == 1) {
      setYearend(year)
    }
  }

  const useYear = (e) => {
    if (state == 0) {
      setState(1)
    }
    if (state == 1) {
      if (yearstart <= yearend) {
        setParentYearstart(yearstart)
        setParentYearend(yearend)
        setState(2)
      }
    }
  }

  const clearYear = () => {
    setParentYearstart('')
    setParentYearend('')

    setYearstart('')
    setYearend('')

    // setKey(key + 1)
  }

  const changeYearstart = (e) => {
    const newYearstart = e.target.value
    if (newYearstart.length == 4)
      setParentYearstart(newYearstart)
  }

  const changeYearend = (e) => {
    const newYearend = e.target.value
    if (newYearend.length == 4)
      setParentYearend(newYearend)
  }

  const unselect = (e) => {
    if (state == 0) {
      setYearstart('')
    }
  }

  let title = ''
  if (state == 0)
    title = "first pick a start date"
  else if (state == 1)
    title = "then pick an end date"

  const picker = Array.apply(null, { length: N }).map((val, idx) => {
    const year = idx + MIN_DATE
    return <span
      key={idx}
      onClick={useYear}
      onMouseEnter={(e) => setYear(year)}>|</span>
  })

  const date_not_specified = yearstart ? {} : { "display": "none" }

  return <div>


    <div className={styles.date_picker}>
      <span
        onClick={goLeft}
        className={styles.date_left_arrow}>&#10148;
      </span>

      <input
        id='yearstart'
        size="4"
        value={yearstart}
        onChange={changeYearstart}>
      </input>
      to
      <input
        id='yearend'
        size="4"
        value={yearend}
        onChange={changeYearend}>
      </input>

      <span
        onClick={goRight}
        className={styles.date_right_arrow} >&#10148;
      </span>
      &nbsp;
      <button
        style={date_not_specified}
        onClick={clearYear}>X
      </button>

    </div>

    <div
      className={styles.year_picker}
      title={title}
      onMouseOut={unselect}>
      {picker}
    </div>

  </div>
}

export default YearPicker