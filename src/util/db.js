const { Pool } = require('pg');

const pgOptions = {
    connectionString: process.env.DATABASE_URL_GCE,
    ssl: false // { rejectUnauthorized: false }
}

// console.log(pgOptions)
const pool = new Pool(pgOptions);

// pg will convert dates to datetimes by default, we don't want that.
var types = require('pg').types;
types.setTypeParser(types.builtins.DATE, (str) => str);

async function performSQLQuery(query) {
    // console.log('===> performSQLQuery, query: \n', query);

    try {
        const response = await pool.query(query);
        return response.rows;
    } catch (error) {
        return error;
        console.log('===> performSQLQuery, error:', error);
    }
}

exports.get_movie = function (tconst) {
	return performSQLQuery(`select * from get_movie('${tconst}');`);
};

function isNullish (query) {
    return !query || query === 'undefined' || query === 'null' || query === ''
}
exports.get_movies = function (numMovies, genres, yearstart, yearend, query, nconst, titletype) {
    const _genres = isNullish(genres) ? null : `'${genres}'`
    const _yearstart = isNullish(yearstart) ? null : yearstart
    const _yearend = isNullish(yearend) ? null : yearend
    const _query = isNullish(query) ? null : `'${query}'`
    const _nconst = isNullish(nconst) ? null : `'${nconst}'`
    const _titletype = isNullish(titletype) ? null : `'${titletype}'`
    // console.log(query, _query)
	const data = performSQLQuery(`select * from get_movies(${numMovies}, ${_genres}, ${_yearstart}, ${_yearend}, ${_query}, ${_nconst}, ${_titletype});`);
    return data
};

exports.count_genres = function (genres, yearstart, yearend, query, nconst, titletype) {
    const _genres = isNullish(genres) ? null : `'${genres}'`
    const _yearstart = isNullish(yearstart) ? null : yearstart
    const _yearend = isNullish(yearend) ? null : yearend
    const _query = isNullish(query) ? null : `'${query}'`
    const _nconst = isNullish(nconst) ? null : `'${nconst}'`
    const _titletype = isNullish(titletype) ? null : `'${titletype}'`
    // console.log(query, _query)
	return performSQLQuery(`select * from count_genres(${_genres}, ${_yearstart}, ${_yearend}, ${_query}, ${_nconst}, ${_titletype} );`);
}

exports.insertDB = async function (tconst, jsonData) {
    const width=200
    const url_prefix = `https://image.tmdb.org/t/p/w${width}/`
    const tmdb_id = jsonData.id

    const jsonString = JSON.stringify(jsonData).replace(/'/g,"''")
    const cmd = `
    INSERT INTO tmdb
    SELECT '${tconst}' as tconst, 
      ${tmdb_id} as tmdb_id,

      case 
        when poster_path is not null 
        then concat('${url_prefix}', poster_path) 
      else 
        null 
      end as poster_path, 

      case 
        when backdrop_path is not null 
        then concat('${url_prefix}', backdrop_path) 
      else 
        null 
      end as backdrop_path, 

      overview
    FROM json_populate_record (NULL::tmdb,'${jsonString}');
    `
    // console.log(cmd)

    return await performSQLQuery(cmd)  
}

exports.deletePoster = async function (tconst) {
    const cmd = `delete from posters where tconst='${tconst}'`
    return performSQLQuery(cmd)
}