const semantic_release_types = require("./release.config").__types
let types = semantic_release_types
	.map(_ => _.type)
	.filter(_ => _ !== undefined)
types = [ ...new Set(types) ]

module.exports = {
	"rules": {
		"subject-full-stop": [ 0 ],
		"header-max-length": [ 1, "always", 100 ],
		'subject-case': [ 1, 'never', [ 'sentence-case', 'start-case', 'pascal-case', 'upper-case' ] ],
		"type-enum": [ 2, "always", types ],
		'body-leading-blank': [ 2, 'always' ],
		'footer-leading-blank': [ 2, 'always' ],
		'type-case': [ 2, 'always', 'lower-case' ],
		'scope-case': [ 2, 'always', 'lower-case' ],
		'subject-empty': [ 2, 'never' ],
		'type-empty': [ 2, 'never' ],
	}
}
