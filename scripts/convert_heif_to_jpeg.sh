#!/bin/bash
for file in public/reviews/*.heif; do
  sips -s format jpeg "$file" --out "${file%.*}.jpeg"
  rm "$file"
done