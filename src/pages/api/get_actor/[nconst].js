import db from '@/util/db'
import { getActor } from '@/util/tmdb_fill'

export default async function handler (req, res) {
  const { nconst } = req.query
  const data = await getActor(nconst)

  res.status(200).json(data)
}