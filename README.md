# label-regex
Github Action to put label base on a pull request field and regex.

This action will use a regex to **automatically create** and assign label to a Pull Request.
It can be useful when working with ticket number or pattern for naming branch of PR title.

When the regex have multi groups, the action will use the first matching group.

## Variables

|Variable| Required | Default               | Possible values                      | Description                                                                                                          |
|---|----------|-----------------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------------|
|`field`| `true`   |                       | `title`, `body`, `branch`            | With what the regex will be performed on.                                                                            |
|`regex`| `true`   |                       | Any valide regex that return a group | The regex to match with the field. Example: `([A-Z]+?)-`, will match PR title: `FIX-1234 My awsome bug fix` => `FIX` |
|`lowercase`| `false`  | `false`               | `true`, `false`                      | Force to lowercase the match for the label name                                                                      |
|`token`| `false`  | `${{ github.token }}` |                                      | A private Github access token                                                                                        |

## Example of action config

```yml
on:
  pull_request:
    types: [opened, edited]

jobs:
  label_regex:
    runs-on: ubuntu-latest
    name: Add label
    steps:
      - name: "Assign label to new Pull Request"
        uses: Bhacaz/label-regex@v2.1
        with:
          field: title
          regex: '([A-Z]+?)-'
          lowercase: true
          token: ${{ github.token }}
```

## Regex examples

### Simple

```regex
^(\w+)-
```

| PR title                    | -> Label added |
|------------------------------------|-------------|
| BUG-123 Fix something              | bug         |


### More complexe

```regex
^chore\(.*(deps)\)|^(fix|hotfix|feat|refactor|docs)
```

| PR title                    | -> Label added |
|------------------------------------|-------------|
| chore(deps)                        | deps        |
| chore(dev-deps)                    | deps        |
| fix(admin): updated something      | fix         |
| fix: updated something             | fix         |
| refactor(admin): changed something | refactor    |
| refactor: changed something        | refactor    |
| docs(admin): about something       | docs        |
| docs: about something              | docs        |
