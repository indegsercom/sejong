import { NowRequest, NowResponse } from '@now/node'
import { transaction } from '../_lib/db'
import { sql } from 'slonik'
import gray from 'gray-matter'
import octokit from '../_lib/octokit'
import { storyBranch } from '../_lib/config'

export default async (req: NowRequest, res: NowResponse) => {
  const tx = transaction(req)

  switch (req.method) {
    case 'GET': {
      tx((t) =>
        t.many(
          sql`select id, slug, front_matter, modified_at from story order by modified_at desc`
        )
      )
        .then((d) => res.json(d))
        .catch((err) => res.json([]))
      break
    }
    default: {
      const { content } = req.body
      const { data } = gray(content)
      const iso = new Date().toISOString()
      const prefix = iso.slice(0, 10).replace(/-/g, '/')
      const slug = `${prefix}/${req.body.slug}`

      const c = Buffer.from(content).toString('base64')

      try {
        const fileResponse = await octokit.repos.createOrUpdateFile({
          owner: 'indegser',
          repo: 'story',
          message: `Create ${slug}`,
          content: c,
          branch: storyBranch,
          path: `${slug}/content.md`,
        })

        const { commit, content } = fileResponse.data
        const github = {
          commit: {
            sha: commit.sha,
            branch: storyBranch,
            message: commit.message,
          },
          file: {
            sha: content.sha,
            downloadUrl: content.download_url,
            gitUrl: content.git_url,
          },
        }
        const result = await tx((t) => {
          return t.one(sql`
            insert into story(slug, front_matter, github) values (${sql.join(
              [slug, JSON.stringify(data), JSON.stringify(github)],
              sql`,`
            )})
            returning *
          `)
        })

        res.json(result)
      } catch (err) {
        console.log(err.message)
        res.status(404).send(JSON.stringify(err))
      }

      // res.json({})
    }
  }
}
