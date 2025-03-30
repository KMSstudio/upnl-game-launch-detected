@echo off
setlocal enabledelayedexpansion

:: Show recent git tags
echo ================================
echo Recent git tags:
echo -------------------------------
for /f "tokens=*" %%A in ('git for-each-ref --sort=-creatordate --count=3 --format="%%(refname:short)" refs/tags') do (
    echo %%A
)
echo ================================

:: Get commit message and version input
set /p ver="Version name: "

:: Move to develop branch (assumed as current working branch)
git checkout develop

:: Versioning (modifies package.json and package-lock.json)
npm version %ver%

:: Stage and commit version bump
git add package.json package-lock.json
git commit -m "%ver%"

:: Move to main branch
git checkout main

:: Merge develop into main
git merge develop -m "Merge version %ver% from develop"

:: Push changes to main and tags
git push origin main
git push origin --tags

:: Return to develop
git checkout develop

echo ================================
echo Merged version %ver% into main
echo ================================