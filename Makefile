# Define the target branch
TARGET_BRANCH := main

.PHONY: default

default: install compile

create-change-log:
	@echo "# Changelog" > CHANGELOG.md
	@echo "\nAll notable changes to this project will be documented in this file." >> CHANGELOG.md
	@echo "\n## $(shell date +'%Y-%m-%d')\n" >> CHANGELOG.md
	@echo "$$(git log $(shell git describe --tags --abbrev=0)..HEAD --pretty=format:'* %s (by @%an)' --abbrev-commit --date=short)" >> CHANGELOG.md

# Check if the current branch is 'main'
check-main-branch: create-change-log
	@branch=$(shell git rev-parse --abbrev-ref HEAD) && \
	if [ "$$branch" != "$(TARGET_BRANCH)" ]; then \
		echo "Error: You must be on the $(TARGET_BRANCH) branch to create a release."; \
		exit 1; \
	fi

# Patch release: Increment the patch version and push
patch-release: check-main-branch
	@echo "Creating patch release..."
	@git add CHANGELOG.md
	@git commit -am "Added change log"
	@npm version patch -m "Release v%s"
	@git push origin $(TARGET_BRANCH)
	@git push origin $(TARGET_BRANCH) --tags
	@echo "Patch release completed and pushed."

# Minor release: Increment the minor version and push
minor-release: check-main-branch
	@echo "Creating minor release..."
	@git add CHANGELOG.md
	@git commit -am "Added change log"
	@npm version minor -m "Release v%s"
	@git push origin $(TARGET_BRANCH) --tags
	@echo "Minor release completed and pushed."

install:
	npm install

dev:
	npm run compile-watch

compile:
	npm run compile

pretty:
	npm run prettier:fix

test:
	npm run test

package: install compile
	npm run vscode:package

# Default help command
help:
	@echo "Usage:"
	@echo "  make patch-release   # Creates a patch release (increments patch version)"
	@echo "  make minor-release   # Creates a minor release (increments minor version)"
	@echo "  make install         # Install necessary npm packages for development"
	@echo "  make dev             # Start development server" 
	@echo "  make compile         # Compile the extension"
	@echo "  make pretty          # Prettify the typescript" 
	@echo "  make test            # Run jest tests"
	@echo "  make package         # Package the extension into *.vsix"

