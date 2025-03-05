# Release checklist

This checklist is meant to be used as a guide for the release process.

## Requirements

- [npm](https://github.com/crate-ci/cargo-release)

## Steps

- [ ] Swich to `main` branch
- [ ] Make sure to have no staged commits.
- [ ] Run `make patch-release` or `make minor-release` to handle the version bump, changelog, and commit.

## Handling breaking changes in CLI

- [ ] Change the following value in `package.json`

```javascript
  "supportedAderynVersions": {
    "major": 0,
    "minor": 4
  }
```

- [ ] Cut a release (patch or minor) using the steps above
