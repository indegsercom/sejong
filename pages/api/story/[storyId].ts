import cors from 'micro-cors'
import nanoid from 'nanoid'
import { NotFoundError } from 'slonik'
import { db, sql } from '../../../src/database'

const middy = () => responder => async (req, res) => {
  const requestId = nanoid(7)
  try {
    const data = await cors()(responder)(req, res)
    res.json({ requestId, data, error: null })
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.statusCode = 404
    } else {
      res.statusCode = 400
    }
    res.json({
      requestId,
      data: null,
      error: err.message,
    })
  }
}

const handler = async (req, res) => {
  const { storyId } = req.query

  switch (req.method) {
    case 'DELETE': {
      const result = await db.one(sql`
        delete from story where id = ${storyId}
        returning story.id
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
