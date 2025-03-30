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
set /p ver="New version: "

:: develop 브랜치로 이동
git checkout develop
git pull origin develop

:: main 브랜치로 이동
git checkout main
git pull origin main

:: merge develop into main
git merge develop -m "%msg%"

:: 버전 태그 생성 및 푸시
npm version %ver%
git push origin main --follow-tags

:: develop 브랜치로 복귀
git checkout develop