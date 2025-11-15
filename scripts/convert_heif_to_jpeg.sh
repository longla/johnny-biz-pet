#!/bin/bash
shopt -s nullglob
for file in public/sitters/*/images/*.heif; do
  sips -s format jpeg "$file" --out "${file%.*}.jpeg"
  rm "$file"
done
