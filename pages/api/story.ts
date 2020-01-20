import { db, sql } from '../../src/database'

// const handler = (mid) => (req, res) => {

//   mid(req, res)
// }

// handler(
//   cors(),
//   responder,
// )

export default async (req, res) => {
  const result = await db.many(sql`select * from story`)
  res.json({ data: result })
}
