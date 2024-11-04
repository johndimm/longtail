import db from '@/util/db'

export default async function handler (req, res) {
  const { tconst } = req.query
  const result = await db.deletePoster(tconst)

  res.status(200).json(result)
}