import { NowRequest, NowResponse } from '@now/node'
import db from '../_lib/db'
import { sql } from 'slonik'

export default async (req: NowRequest, res: NowResponse) => {
  const id = req.query.id.toString()

  switch (req.method) {
    case 'GET': {
      db.one(
        sql`
        select *, book_citation(book) from book where id = ${id}
      `
      )
        .then((d) => res.json(d))
        .catch((err) => res.status(404).send(err.message))
      break
    }
    case 'PUT': {
      const { title, authors, publishedYear, cover } = req.body
      const values = sql.join(
        [title, sql.array(authors, 'text'), publishedYear, cover],
        sql`,`
      )

      db.one(
        sql`
        update book set (title, authors, published_year, cover) = (${values}) where id = ${id}
        returning id
      `
      )
        .then((d) => res.json(d))
        .catch((err) => res.status(404).send(err.message))
      break
    }
    default: {
      res.status(405).end()
    }
  }
}
