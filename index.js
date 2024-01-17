const core = require('@actions/core');
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: core.getInput('token') });
const fieldToMatch = core.getInput('field');
const regexToApply = new RegExp(core.getInput('regex'));
const forceLowerCase = core.getInput('lowercase');
const repository = process.env['GITHUB_REPOSITORY']
const pullRequestNumber = parseInt(/refs\/pull\/(\d+?)\//.exec(process.env['GITHUB_REF'])[1])
const owner = repository.split('/')[0]
const repo = repository.split('/')[1]


function firstMatchingGroup(stringToMatch) {
  const match = regexToApply.exec(stringToMatch)
  if(match) {
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        return match[i]
      }
    }
  }
}

octokit.pulls.get({
    owner,
    repo,
    pull_number: pullRequestNumber,
  })
  .then((data) => {
      let labelToAssign;
      if(fieldToMatch === 'branch') {
        labelToAssign = firstMatchingGroup(data.data.head.ref)
      } else {
        labelToAssign = firstMatchingGroup(data.data[fieldToMatch])
      }
      if(labelToAssign) {
        if(forceLowerCase) { labelToAssign = labelToAssign.toLowerCase() }
        console.log('Assigning label: ' + labelToAssign);
         return octokit.issues.addLabels({
            owner,
            repo,
            issue_number: pullRequestNumber,
            labels: [labelToAssign]
        })
      }
  })
  .catch(err => {
      console.log(err);
  })
