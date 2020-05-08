import { NowRequest, NowResponse } from '@now/node'
import { transaction } from '../_lib/db'
import { sql } from 'slonik'
import gray from 'gray-matter'

export default async (req: NowRequest, res: NowResponse) => {
  const tx = transaction(req)

  switch (req.method) {
    case 'GET': {
      tx((t) =>
        t.many(
          sql`select id, slug, data, modified_at from story order by modified_at desc`
        )
      )
        .then((d) => res.json(d))
        .catch((err) => res.json([]))
      break
    }
    case 'PUT': {
      const { id, content } = req.body
      const { data } = gray(content)

      try {
        const result = await tx((t) => {
          return t.one(sql`
            update story set(data, content) = (${JSON.stringify(
              data
            )}, ${content}) where id = ${id}
            returning *
          `)
        })

        res.json(result)
      } catch (err) {
        res.status(404).send(err.message)
      }
      break
    }
    case 'POST': {
      /**
       * CREATE STORY
       * { slug: 'hello-world', content: string }
       */
      const { slug, content } = req.body
      // TODO. Validate req.body

      const { data } = gray(content)
      const iso = new Date().toISOString()
      const prefix = iso.slice(0, 10).replace(/-/g, '/')
      const fullSlug = `${prefix}/${slug}`

      try {
        const result = await tx((t) => {
          return t.one(sql`
            insert into story(slug, data, content) values (${fullSlug}, ${JSON.stringify(
            data
          )}, ${content})
            returning *
          `)
        })

        res.json(result)
      } catch (err) {
        res.status(404).send(err.message)
      }

      // res.json({})
    }
  }
}
