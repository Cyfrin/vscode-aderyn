#!/bin/bash

# Ensure the script is run with a version argument
if [ -z "$1" ]; then
  echo "Please provide a version (e.g., 1.0.1)"
  exit 1
fi

VERSION=$1

# Create the vsix package
npm install
npm run vscode:package

# Find the `.vsix` file (adjust to your actual file path or naming convention)
VSIX_FILE=$(ls *.vsix | head -n 1)

if [ -z "$VSIX_FILE" ]; then
  echo "No .vsix file found to upload"
  exit 1
fi

# Generate the changelog from the last release tag to the current commit
CHANGELOG=$(cat CHANGELOG.md)

# Escape the release body properly for JSON
RELEASE_BODY=$(echo "$CHANGELOG" | jq -Rs .)

# Create the release using GitHub API
RESPONSE=$(curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -d "{\"tag_name\":\"$VERSION\", \"name\":\"Release $VERSION\", \"body\":$RELEASE_BODY, \"draft\":false, \"prerelease\":false}" \
  https://api.github.com/repos/Cyfrin/vscode-aderyn/releases)

echo "Create release reponse: $RESPONSE"

# Extract the upload URL from the response
UPLOAD_URL=$(echo $RESPONSE | jq -r .upload_url | sed -e "s/{?name,label}//")

echo "Upload url: $UPLOAD_URL"

# Upload the .vsix file to the release
curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @"$VSIX_FILE" \
  "$UPLOAD_URL?name=$VSIX_FILE"

echo "Release created and .vsix asset uploaded for $VERSION."

