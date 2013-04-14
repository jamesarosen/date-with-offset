test: jshint
	@mocha
	@echo "Tests OK"

jshint:
	@node_modules/jshint/bin/jshint index.js test
	@echo "JSHint OK"

.PHONY: test jshint
