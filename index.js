const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

async function main() {
  const token = core.getInput('token', { required: true })
  const sha = core.getInput('sha', { required: true })

  const gh = getOctokit(token, {})
  const args = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: sha
  }
  core.info(`args: '${JSON.stringify(args)}'`)

  const pullRequests = await gh.repos.listPullRequestsAssociatedWithCommit(args)
  core.info(`pullRequests: '${JSON.stringify(pullRequests)}'`)

  if (!pullRequests || !pullRequests.data || pullRequests.data.length === 0) {
    throw new Error('pull request not found')
  }

  const pullRequest = pullRequests.data[0]
  core.setOutput('pullRequest', JSON.stringify(pullRequest))
}

main().catch(e => core.setFailed(e.message))
