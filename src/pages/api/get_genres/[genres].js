import db from '@/util/db'

export default async function handler (req, res) {
  const {
		query: { genres, year }
	} = req

  // const { genres, year } = req.query
  const response = await db.get_movies(genres, null)
  res.status(200).json(response)
}