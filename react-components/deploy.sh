#!/bin/sh

set -e

npm run build
git switch gh-pages
git ls-files . | xargs --no-run-if-empty rm -rf
cp -R ./dist/* .
git add .
git commit -m "deploy(react-components): `date +\"%H:%M %d/%m/%Y\"`"
git push origin gh-pages