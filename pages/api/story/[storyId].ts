import cors from 'micro-cors'
import nanoid from 'nanoid'
import { db, sql } from '../../../src/database'

const middy = () => responder => async (req, res) => {
  try {
    const data = await cors()(responder)(req, res)
    res.json({ requestId: nanoid(7), data })
  } catch (err) {
    console.log(err)
    res.json({ err })
  }
}

const handler = async (req, res) => {
  const { storyId } = req.query

  switch (req.method) {
    case 'DELETE': {
      await db.query(sql`
        delete from story where id = ${storyId}
      `)
      return { storyId }
    }
    case 'GET': {
      const story = await db.one(sql`
        select * from story where id = ${storyId}
      `)

      return res.json({ story })
    }
  }
}

export default middy()(handler)
