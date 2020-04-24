import { NowRequest, NowResponse } from '@now/node'
import db from '../_lib/db'
import { sql } from 'slonik'

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method !== 'GET') return res.status(405).end()

  db.many(
    sql`select id, title, cover, modified_at, book_citation(book) as citation from book order by modified_at desc`
  )
    .then((d) => res.json(d))
    .catch((err) => res.json([]))
}
