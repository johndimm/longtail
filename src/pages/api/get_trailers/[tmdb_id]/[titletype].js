import { get_tmdb_trailers } from '@/util/tmdb_fill'

export default async function handler (req, res) {
  const { tmdb_id, titletype } = req.query

  const data = await get_tmdb_trailers(tmdb_id, titletype)

  res.status(200).json(data)
}