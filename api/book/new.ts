import { NowResponse, NowRequest } from '@now/node'
import { transaction } from '../_lib/db'
import { sql } from 'slonik'

export default (req: NowRequest, res: NowResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { title, authors, publishedYear, cover } = req.body
  const tx = transaction(req)

  const values = sql.join(
    [title, sql.array(authors, 'text'), publishedYear, cover],
    sql`,`
  )

  tx((db) => {
    return db.one(sql`
      insert into book(title, authors, published_year, cover) values (${values}) returning id
    `)
  })
    .then((d) => res.json(d))
    .catch((err) => {
      console.log(err)
      res.status(404).json(err)
    })
}
