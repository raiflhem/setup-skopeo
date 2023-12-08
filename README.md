# setup-skopeo


## Usage

```
# in your job:
name: ci
on:
  push:
    branches:
      - '*'
jobs:
  skopeo-example:
    name: skopeo job
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: raiflhem/setup-skopeo@latest
    - name: Get help:
      run: |
        skopeo --help

```

## License

MIT
