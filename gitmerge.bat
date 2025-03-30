@echo off

:: Show recent git tags
echo ================================
echo Recent git tags:
echo -------------------------------
for /f "tokens=*" %%A in ('git for-each-ref --sort=-creatordate --count=3 --format="%%(refname:short)" refs/tags') do (
    echo %%A
)
echo ================================

:: Get commit message and version input
set /p msg="Merge commit message: "
set /p ver="Version name: "

:: Move to develop branch
git checkout develop
git pull origin develop

:: Move to main branch
git checkout main
git pull origin main

:: Merge develop into main
git merge develop -m "%msg%"

:: Commit merge result before running npm version
git add .
git commit -m "Merge develop into main: %msg%"

:: Create new version tag (this modifies package.json and lock)
npm version %ver%

:: Commit version bump
git add .
git commit -m "Bump version to %ver%"

:: Push main branch and tags
git push origin main
git push origin --tags

:: Switch back to develop branch
git checkout develop