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

octokit.pulls.get({
    owner,
    repo,
    pull_number: pullRequestNumber,
  })
  .then((data) => {
      console.log(data.data.head)
      if(fieldToMatch === 'branch') {
        let labelToAssign = regexToApply.exec(data.data.head.ref)[1]
      } else {
        let labelToAssign = regexToApply.exec(data.data[fieldToMatch])[1]
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
