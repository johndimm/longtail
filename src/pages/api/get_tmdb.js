import { getTheMovieDatabase } from "@/util/tmdb_fill"

export default async function handler (req, res) {
  const { tconst, titletype } = req.query
  const response = await getTheMovieDatabase(tconst, titletype)
  res.status(200).json( response )
}