import { db, sql } from '../../src/database'

export default async (req, res) => {
  const result = await db.query(sql`select 1 + 1`)
  res.json({ hello: result })
}
