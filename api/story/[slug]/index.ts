import { NowRequest, NowResponse } from '@now/node'
import db from '../../_lib/db'
import { sql } from 'slonik'

export default async (req: NowRequest, res: NowResponse) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  const { slug } = req.query

  db.one(
    sql`
    select slug, sha, front_matter, modified_at from story where slug = ${slug}
  `
  )
    .then((data) => void res.json(data))
    .catch((err) => void res.status(404).send(err.message))
}
