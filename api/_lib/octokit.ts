import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export const createStoryMd = async (
  path: string,
  content: string,
  sha?: string
) => {
  console.log(
    'Creating story markdown in branch: ',
    process.env.STORY_GIT_BRANCH
  )
  const { data } = await octokit.repos.createOrUpdateFile({
    repo: 'story',
    owner: 'indegser',
    branch: process.env.STORY_GIT_BRANCH,
    path,
    sha,
    message: `${sha ? 'Update' : 'Create'} ${path}`,
    content: Buffer.from(content).toString('base64'),
  })

  const { sha: contentSha, download_url: contentUrl } = data.content
  const { sha: commitSha, message: commitMessage } = data.commit
  const git = {
    contentSha,
    contentUrl,
    commitSha,
    commitMessage,
  }

  return git
}

export default octokit
