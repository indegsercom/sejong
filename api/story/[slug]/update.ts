import { NowRequest, NowResponse } from '@now/node'
import db from '../../_lib/db'
import { sql } from 'slonik'
import octokit from '../../_lib/octokit'
import gray from 'gray-matter'

export default async (req: NowRequest, res: NowResponse) => {
  const { id } = req.query
  const { content } = req.body
  const { data } = gray(content)
  const { gitSha, slug } = await db.one(
    sql`select git_sha, slug from story where id = ${id}`
  )

  const result = await octokit.repos.createOrUpdateFile({
    path: `${slug}.md`,
    sha: gitSha,
    message: `Update ${slug}.md`,
    content: Buffer.from(content).toString('base64'),
    owner: 'indegser',
    repo: 'story',
  })

  console.log(result)
  res.json(gitSha)
}
