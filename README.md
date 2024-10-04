[![Release](https://github.com/alanscodelog/my-semantic-release-config/actions/workflows/release.yml/badge.svg)](https://github.com/alanscodelog/my-semantic-release-config/actions/workflows/release.yml)
[![NPM Version (with latest tag)](https://img.shields.io/npm/v/%40alanscodelog%2Fsemantic-release-config/latest)](https://www.npmjs.com/package/@alanscodelog/semantic-release-config/v/latest)

My preferred semantic release config:

# Features

- Support for 0.0.0 versioned releases.
- Shows the full commit body in the release notes.
- Uses `semantic-release/git` to commit the version change (makes packages in monorepos easier to handle).

# Install

```bash
yarn add -D @alanscodelog/semantic-release-config
```

```js
// package.json
{
	"release": {
		"extends": "@alanscodelog/semantic-release-config",
		"assets": [
			// { path: "", label: "" }
		]
		// see notes below regarding the passing of global options
	}
}
```

# Types
`typename` Changelog Header (release type)

## Shown in Changelog

`feat` :star: New Features (minor)

`fix` :bug: Fixes (patch)

`revert` :arrow_backward: Reverts (patch)

`docs` :book: Documentation` (not released) - not released because they'd get built and published to github pages anyways

`docs(readme)` (patch) - published so npm's readme gets updated

`perf` :rocket: Performance Improvements (patch)

The commit body is shown by default, this can be disabled by setting the `SEMANTIC_RELEASE_HIDE_COMMIT_BODY` environment variable to `TRUE`, or per commit by adding `<!--skip-release-notes-->` to the commit body.

### 0.0.0 Versioned Releases

Workaround for semantic-release's lack of 0.0.0 versioning ([see](https://github.com/semantic-release/semantic-release/issues/1507)).

For the following to work there must be an initial commit tagged v0.0.0 (I usually just make this empty. After, a `v0feat: initial commit` can be made and semantic release will release it as v0.0.1. So long as you use `v0*` release types or any release type that is only a patch, you will stay in major version 0.

`v0feat` :star: New Features (patch)

`v0fix` :bug: Fixes (patch) - technically a regular fix would also work

`v0breaking` :warning: BREAKING CHANGES (minor) - use this tag for breaking changes, it looks like a breaking change in release logs but isn't really one for semantic-release.

***Do NOT use BREAKING CHANGES in the commit text, it will cause a major version bump.***

## Hidden from the Changelog
I set changelog headers just in case I want to unhide them.

`tests` :white_check_mark: Tests (patch)

`chore` :wrench: Chores (patch)

`deps` :link: Dependency Updates (patch)

`ci` :arrows_counterclockwise: CI (patch)

`build` :hammer: Build (patch)

`style` :art: Code Style (patch)

`refactor` :package: Code Refactoring (patch)

`[any](no-release)` (not released)

# Branches

- any maintenance branches (x.x.x)
- master
- alpha
- beta

Personally I try to stick with master and beta to keep things simple.

# Plugins Used

```bash
@semantic-release/commit-analyzer
@semantic-release/release-notes-generator
@semantic-release/git
@semantic-release/github
@semantic-release/npm
```

# Notes

- The `@semantic-release/github` and `@semantic-release/npm` plugins are used in the config without options so global options will be passed down to them, but, for other plugins, it doesn't seem possible to override any options that were already passed down to them.

- Additionally note the debug flag for semantic-release does not seem to reflect the passing of this global options. I have filed an issue regarding all this [here](https://github.com/semantic-release/semantic-release/issues/1567)
