
// feat, fix, revert, docs(readme), perf, tests, chore, deps, ci, build, style, refactor, [any type](no-release)
const hidden = true
const types = [
	// scopes can't be configured because they're grouped? not even to hide them?
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

let releaseRules = types.filter(_ => _.release !== undefined).map(_ => (_.scope
	// if scope is undefined, it's interpreted differently than the scope property not existing at all
	? { type: _.type, release: _.release, scope: _.scope }
	: { type: _.type, release: _.release }
))

let presetConfig_types = types.filter(_ => _.section !== undefined).map(_ => ({ type: _.type, section: _.section, hidden: _.hidden }))

module.exports = {
	__types: types,
	plugins: [
		[ "@semantic-release/commit-analyzer", {
			releaseRules
		} ],
		[ "@semantic-release/release-notes-generator", {
			preset: "conventionalcommits",
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
			},
			presetConfig: {
				types: presetConfig_types
			}
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
