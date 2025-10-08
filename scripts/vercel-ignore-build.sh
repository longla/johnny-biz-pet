#!/bin/bash

# This script checks the current branch name.
# It exits with 1 to proceed with a build, or 0 to cancel it.

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "dev" ]] ; then
  # Allow builds for "main" and "dev" branches.
  exit 1;
else
  # Cancel builds for any other branch.
  exit 0;
fi
