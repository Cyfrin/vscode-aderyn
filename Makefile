# Define the target branch
TARGET_BRANCH := main

# Check if the current branch is 'main'
check-main-branch:
	@branch=$(shell git rev-parse --abbrev-ref HEAD) && \
	if [ "$$branch" != "$(TARGET_BRANCH)" ]; then \
		echo "Error: You must be on the $(TARGET_BRANCH) branch to create a release."; \
		exit 1; \
	fi

# Patch release: Increment the patch version and push
patch-release: check-main-branch
	@echo "Creating patch release..."
	@npm version patch -m "Release v%s"
	@git push origin $(TARGET_BRANCH) --tags
	@echo "Patch release completed and pushed."

# Minor release: Increment the minor version and push
minor-release: check-main-branch
	@echo "Creating minor release..."
	@npm version minor -m "Release v%s"
	@git push origin $(TARGET_BRANCH) --tags
	@echo "Minor release completed and pushed."

# Default help command
help:
	@echo "Usage:"
	@echo "  make patch-release   # Creates a patch release (increments patch version)"
	@echo "  make minor-release   # Creates a minor release (increments minor version)"

