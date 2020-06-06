[![Release](https://github.com/alanscodelog/my-semantic-release-config/workflows/Release/badge.svg)](https://www.npmjs.com/package/@alanscodelog/semantic-release-config)

My preferred semantic release config.

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

`revert` :arrow_backward: Reverts patch)


`docs` :book: Documentation` (not released) - not released because they'd get built and published to github pages anyways

`docs(readme)` (patch) - published so npm's readme gets updated

`perf` :rocket: Performance Improvements (patch)

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

- any maintanance brances (x.x.x)
- master
- alpha
- beta

Personally I try to stick with master and beta to keep things simple.

# Plugins Used

```bash
@semantic-release/commit-analyzer
@semantic-release/release-notes-generator
@semantic-release/github
@semantic-release/npm
```

# Notes

- The `@semantic-release/github` and `@semantic-release/npm` plugins are used in the config without options so global options will be passed down to them, but, for other plugins, it doesn't seem possible to override any options that were already passed down to them.

- Aditionally note the debug flag for semantic-release does not seem to reflect the passing of this global options. I have filed an issue regarding all this [here](https://github.com/semantic-release/semantic-release/issues/1567)
