import fs from "fs"
const __dirname = import.meta.dirname;
const commitPartial = fs.readFileSync(`${__dirname}/template.hbs`).toString()

const showCommitBody = process.env.SEMANTIC_RELEASE_HIDE_COMMIT_BODY !== 'TRUE'

// feat, fix, revert, docs(readme), perf, tests, chore, deps, ci, build, style, refactor, [any type](no-release)
const hidden = true
const types = [
	// scopes can't be configured because they're grouped? not even to hide them?
	{ breaking: true, release: 'major' },

	{ type: "v0feat", section: ":star: New Features", release: "patch" },
	{ type: "v0fix", section: ":bug: Fixes", release: "patch" },
	{ type: "v0breaking", section: ":warning: BREAKING CHANGES", release: "minor" },
	{ type: "feat", section: ":star: New Features", release: "minor" },
	{ type: "fix", section: ":bug: Fixes", release: "patch" },
	{ type: "revert", section: ":arrow_backward: Reverts", release: "patch" },

	{ type: "docs", section: ":book: Documentation", release: false }, // they'd get built and published anyways
	{ type: "docs", scope: "readme", release: "patch" }, // so npm's readme is updated

	{ type: "perf", section: ":rocket: Performance Improvements", release: "patch" },

	// HIDDEN
	{ type: "tests", section: ":white_check_mark: Tests", hidden, release: "patch" },

	{ type: "chore", section: ":wrench: Chores", hidden, release: "patch" },
	{ type: "deps", section: ":link: Dependency Updates", hidden, release: "patch" },
	{ type: "ci", section: ":arrows_counterclockwise: CI", hidden, release: "patch" },
	{ type: "build", section: ":hammer: Build", hidden, release: "patch" },

	{ type: "style", section: ":art: Code Style", hidden, release: "patch" },
	{ type: "refactor", section: ":package: Code Refactoring", hidden, release: "patch" },

	{ scope: "no-release", release: false },
]

const releaseRules = types.filter(_ => _.release !== undefined).map(_ => {
	const clone = {}
	for (let key of Object.keys(_)) {
		if (["scope", "type", "breaking", "release"].includes(key)) {
			if (_[key] !== undefined) clone[key] = _[key]
		}
	}
	return clone
})

const presetConfig_types = types.filter(_ => _.section !== undefined).map(_ => ({ type: _.type, section: _.section, hidden: _.hidden }))
const parserOpts = {
	noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
}

export default{
	__types: types,
	plugins: [
		[ "@semantic-release/commit-analyzer", {
			releaseRules,
			parserOpts,
		} ],
		[ "@semantic-release/release-notes-generator", {
			parserOpts,
			presetConfig: {
				types: presetConfig_types
			},
			writerOpts: {
				groupBy: "type",
				// sorts commits in each group by if they have a scope (last) and then by date
				commitsSort: (a, b) => {
					if (a.scope === null && b.scope) return -1
					if (b.scope === null && a.scope) return 1
					let by_date = a.committerDate - b.committerDate
					if (a.scope === b.scope) return by_date
					return a.scope - b.scope
				},
				//sorts the groups in the order we declare our types
				commitGroupsSort: (a, b) => {
					let types_a_index = types.findIndex(_ => _.section === a.title)
					let types_b_index = types.findIndex(_ => _.section === b.title)

					let title_compare = types_a_index - types_b_index
					return title_compare
				},
				...(showCommitBody ? {
					commitPartial,
					finalizeContext: (context) => {
						for (const commitGroup of context.commitGroups) {
							for (const commit of commitGroup.commits) {
								if (commit.body?.includes("<!--skip-release-notes-->")) continue
								commit.commitBody = commit.body//?.split('\n')
							}
						}
						return context
					}
				} :{}),
			},
		} ],
		"@semantic-release/github",
		"@semantic-release/npm",
	],
	branches: [
		"+([0-9])?(.{+([0-9]),x}).x",
		"master",
		{ name: "alpha", prerelease: true },
		{ name: "beta", prerelease: true },
	],
}
