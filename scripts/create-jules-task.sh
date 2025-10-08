#!/bin/bash

# A script to create a new task for Jules, based on the 'dev' branch.
#
# Usage:
# ./scripts/create-jules-task.sh "Your Task Title" "path/to/description.md"

# --- Configuration ---
ASSIGNEE="jules"
BASE_BRANCH="dev"

# --- Script Logic ---
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

echo "🚀 Creating task for '$ASSIGNEE' based on branch '$BASE_BRANCH'..."
echo "   - Title: $TITLE"
echo "   - Description File: $DESCRIPTION_FILE"
echo "--------------------------------------------------"

# Execute the jules CLI command
jules task:create \
  --title "$TITLE" \
  --description-file "$DESCRIPTION_FILE" \
  --assignee "$ASSIGNEE" \
  --base-branch "$BASE_BRANCH"

echo "--------------------------------------------------"
echo "✅ Task creation command executed."
