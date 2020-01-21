import { db, sql } from '../../../src/database'
import handler from '../../../src/handler'

const responder = async (req, res) => {
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

export default handler()(responder)
