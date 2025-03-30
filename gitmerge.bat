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
set /p vercc="Version name: "
:: Move to develop branch (assumed as current working branch)
git checkout develop

:: Stage and commit version bump
git tag %vercc%
git add .
git commit -m "%vercc%"

:: Move to main branch
git checkout main

:: Merge develop into main
git merge develop -m "Merge version %vercc% from develop"

:: Push changes to main and tags
git push origin main
git push origin --tags

:: Return to develop
git checkout develop

echo ================================
echo Merged version %vercc% into main
echo ================================