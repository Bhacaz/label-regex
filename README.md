# label-regex
Github Action to put label base on field and regex.

This action will use a regex to automatically create and assign label to a Pull Request.
It can be useful when working with ticket number or pattern for naming branch of PR title.

## Variables

* `field`: With what the regex will be performed on. Values supported are `title`, `body` and `branch`.
* `regex`: 'The regex to match with the field. Example: `([A-Z]+?)-`, will match `FIX-1234 My awsome bug fix` => `FIX`'
* `lowercase`: Force to lowercase the label name
* `token`: A personal Github access token

## Exemple of action config

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
        uses: Bhacaz/label-regex@main
        with:
          field: title
          regex: '([A-Z]+?)-'
          token: ${{ secrets.GH_TOKEN }}
```
