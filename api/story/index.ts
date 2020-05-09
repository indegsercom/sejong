import { NowRequest, NowResponse } from '@now/node'
import db, { transaction } from '../_lib/db'
import { sql } from 'slonik'
import gray from 'gray-matter'
import { authenticate } from '../_lib/auth'
import { createStoryMd } from '../_lib/octokit'

export default async (req: NowRequest, res: NowResponse) => {
  const tx = transaction(req)

  switch (req.method) {
    case 'GET': {
      db.many(
        sql`select id, slug, data, modified_at from story order by modified_at desc`
      )
        .then((d) => res.json(d))
        .catch((err) => {
          console.log(err)
          res.json([])
        })
      break
    }
    case 'PUT': {
      const auth = authenticate(req)
      if (!auth) {
        return res.status(401).end()
      }
      const { id, slug, content } = req.body
      const { data } = gray(content)

      try {
        const result = await tx(async (t) => {
          const { git } = await t.one(
            sql`select git from story where id = ${id}`
          )

          const nextGit = await createStoryMd(
            slug + '.md',
            content,
            git.contentSha
          )

          const values = sql.join(
            [slug, JSON.stringify(data), JSON.stringify(nextGit), content],
            sql`,`
          )

          return t.one(sql`
            update story set(slug, data, git, content) = (${values}) where id = ${id}
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
      const auth = authenticate(req)
      if (!auth) {
        return res.status(401).end()
      }

      const { slug, content } = req.body
      // TODO. Validate req.body

      const { data } = gray(content)
      const iso = new Date().toISOString()
      const prefix = iso.slice(0, 10).replace(/-/g, '/')
      const fullSlug = `${prefix}/${slug}`

      const git = await createStoryMd(fullSlug + '.md', content)

      if (!git) {
        return res.status(404).end()
      }
      const values = sql.join(
        [fullSlug, JSON.stringify(data), JSON.stringify(git), content],
        sql`,`
      )

      db.one(
        sql`
            insert into story(slug, data, git, content) values (${values})
            returning *
          `
      )
        .then((r) => res.json(r))
        .catch((err) => res.status(404).send(err.message))
    }
  }
}
