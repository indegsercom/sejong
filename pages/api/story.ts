import { db, sql } from '../../src/database'
import handler from '../../src/handler'
import { createError } from '../../src/errors'

// export default async (req, res) => {
//   const result = await db.many(sql`select * from story`)
//   res.json({ data: result })
// }

const responder = async (req, res) => {
  if (req.method !== 'POST') {
    console.log('hello')
    throw new createError.MethodNotAllowed()
  }
}

export default handler()(responder)
