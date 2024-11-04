import db from '@/util/db'
import { tmdb_fill } from '@/util/tmdb_fill'

export default async function handler (req, res) {
  const {
		query: { numMovies, genres, yearstart, yearend, query, nconst, titletype }
	} = req

  const _numMovies = numMovies ? numMovies : null
  const _genres = genres ? genres : null
  const _yearstart = yearstart ? yearstart : null
  const _yearend = yearend ? yearend : null
  const _query = query ? query : null
  const _nconst = nconst ? nconst : null
  const _titletype = titletype ? titletype : null

  const data = await db.get_movies(numMovies, _genres, _yearstart, _yearend, _query, _nconst, _titletype)

  await tmdb_fill(data)
  
  res.status(200).json(data)
}