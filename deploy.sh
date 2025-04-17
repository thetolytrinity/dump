#!/bin/bash

echo "dump"

# Copy the production build (from dist/) to docs/
rm -rf docs
mkdir docs
cp -r dist/* docs/

echo "copy files"
git add docs
echo "📝 Committing changes..."
git commit -m "more debugging, added tumpzz"
git push

echo "finish line"
