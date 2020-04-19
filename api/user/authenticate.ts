import { NowRequest, NowResponse } from '@now/node'
import db from '../_lib/db'
import { sql } from 'slonik'
import jwt from 'jsonwebtoken'

export default async (req: NowRequest, res: NowResponse) => {
  const { email, password } = req.body

  const payload = await db.one(sql`
    select * from authenticate(${sql.join([email, password], sql`,`)})
  `)

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    issuer: 'sejong',
    audience: 'sejong',
  })

  res.json({ token })
}
