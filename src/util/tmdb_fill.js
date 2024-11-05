import axios from "axios"
import db from '@/util/db'

const insertDB = async (tconst, jsonData) => {
    return await db.insertDB(tconst, jsonData)
}

export const getTheMovieDatabase = async (tconst, titletype) => {
    const key = process.env['TMDB_KEY']

    const url = 'https://api.themoviedb.org/3/find/' + tconst

    var options = {
        method: 'GET',
        url: url,
        params: { api_key: key, language: 'en-US', external_source: 'imdb_id' }
    };

    const tmdb_medium = titletype == 'movie' ? 'movie_results' : 'tv_results'

    const response = await axios.request(options)
    const result = await response.data
    const data = result[tmdb_medium]
    let jsonData = null
    if (data && data.length > 0 ) {
        jsonData = data[0]

        // Remove carriage returns
        if (jsonData.overview) {
            const cleanOverview = jsonData.overview.replace(/[\n\r]/g, ' ')
            jsonData.overview = cleanOverview
        }

        console.log("found in tmdb:", tconst, jsonData)
        insertDB(tconst, jsonData)
    } else {
       jsonData = {"tmdb_id": -1}
       console.log("NOT found in tmdb:", tconst)
       insertDB(tconst, jsonData)
    }

    return jsonData
}

export const tmdb_fill = async (_data) => {
    const width = 200
    const url_prefix = `https://image.tmdb.org/t/p/w${width}/`

    const data = await (_data)

    // Get a unique list of records with missing posters.
    const tconst_missing = {}
    data.filter((r) => !r.tmdb_id)
    
    //!= -1 && (
    //    r.poster_url == null 
    //  || r.plot_summary == '' 
    //  || r.plot_summary == null
    // )
      // || typeof r.plots_summary == 'undefined'


    .forEach((r, idx) => {
        if (!(r.tconst in tconst_missing))
          tconst_missing[r.tconst] = r.titletype
        console.log('missing:', r)
    })
    // console.log('missing tconst', tconst_missing)

    // Fix each record.
    const tconsts = Object.keys(tconst_missing)
    for (let i = 0; i < tconsts.length; i++) {
        const tconst = tconsts[i]
        const tmdb_result = await getTheMovieDatabase(tconst, tconst_missing[tconst])

        // Update the records already downloaded.
        if (tmdb_result 
            && tmdb_result.poster_path 
            && tmdb_result.poster_path.length > 0) {
            //console.log('tmdb_result:', tmdb_result, tconst)
            //console.log('poster:', tmdb_result.poster_path)
            data.filter((r) => r.tconst == tconst).forEach((r) => {
                //console.log('poster:', tmdb_result.poster_path)
                r.poster_url = url_prefix + tmdb_result.poster_path
                r.plot_summary = tmdb_result.overview.substring(0,100) + ". . ."
                //console.log('replaced with tmdb for ', r.primarytitle, r.primaryname)
                // console.log(r)
            })
        }
    }
}

export const getActor = async (nconst) => {
    if (nconst == 'undefined')
        return null

    const key = process.env['TMDB_KEY']

    const url = 'https://api.themoviedb.org/3/find/' + nconst

    var options = {
        method: 'GET',
        url: url,
        params: { api_key: key, language: 'en-US', external_source: 'imdb_id' }
    };

    const tmdb_medium = 'person_results'
    const response = await axios.request(options)
    const result = await response.data
    const data = result[tmdb_medium]
    let jsonData = null
    if (data.length > 0) {
        jsonData = data[0]
    }
    return jsonData
}

export const get_tmdb_trailers = async (tmdb_id, titletype) => {
    if (tmdb_id == 'undefined' || tmdb_id == -1)
        return null

    const key = process.env['TMDB_KEY']
    const trailertype = titletype == 'movie' ? 'movie' : 'tv'

    const url = `https://api.themoviedb.org/3/${trailertype}/${tmdb_id}/videos`

    var options = {
        method: 'GET',
        url: url,
        params: { api_key: key, language: 'en-US', external_source: 'imdb_id' }
    };

    const response = await axios.request(options)
    const result = await response.data
    
    return result.results
}