@echo off
set /p ommit_message="Enter your commit message: "
git add .
git commit -m "%commit_message%"

git checkout develop
git push origin develop
