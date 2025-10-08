#!/bin/bash

# A script to create a new remote session for Jules in the current repo.
#
# Usage:
# ./scripts/create-jules-task.sh "Your Task Title" "path/to/description.md"

# Check if both title and description file are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ Error: Missing arguments."
  echo "Usage: $0 \"<Task Title>\" \"<Description File Path>\""
  exit 1
fi

TITLE=$1
DESCRIPTION_FILE=$2

# Check if the description file exists
if [ ! -f "$DESCRIPTION_FILE" ]; then
  echo "❌ Error: Description file not found at '$DESCRIPTION_FILE'"
  exit 1
fi

# Read the description file content
DESCRIPTION_CONTENT=$(cat "$DESCRIPTION_FILE")

# Combine title and description into a single string for the session
SESSION_CONTENT="Task Title: $TITLE\n\n---\n\n$DESCRIPTION_CONTENT"

echo "🚀 Creating new remote session..."
echo "--------------------------------------------------"

# Pipe the combined content into the 'jules remote new' command
echo "$SESSION_CONTENT" | jules remote new --repo .

echo "✅ Session creation command executed."