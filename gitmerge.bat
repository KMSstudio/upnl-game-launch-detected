@echo off
setlocal enabledelayedexpansion

echo ================================
echo Recent git tag:
echo -------------------------------
for /f "tokens=*" %%A in ('git for-each-ref --sort=-creatordate --count=3 --format="%%(refname:short)" refs/tags') do (
    echo %%A
)
echo ================================

set /p msg="Merge commit message: "
set /p ver="Version name: "

:: move to develop branch
git checkout develop
git pull origin develop

:: move to main branch
git checkout main
git pull origin main

:: merge develop into main
git merge develop -m "%msg%"

:: new version
npm version %ver%

:: push
git push origin main --follow-tags
git checkout develop