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

:: Get version input
set /p ver="Version name: "

:: Move to develop branch
git checkout develop

:: Run npm version (auto-commit + tag)
npm version !ver! || goto :error

:: Move to main
git checkout main

:: Merge develop into main
git merge develop -m "Merge version !ver! from develop"

:: Push to main and push tag
git push origin main
git push origin --tags

:: Return to develop
git checkout develop

echo ================================
echo ✅ Merged version !ver! into main
echo ================================
goto :eof

:error
echo ❌ npm version failed or script was interrupted.
pause
exit /b
