git pull --rebase origin master

npm install --silent

node track.js

git add -A
git commit -m "$(git status --porcelain)"
git push origin master
