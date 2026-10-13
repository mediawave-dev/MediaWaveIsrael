@echo off
REM ============================================================================
REM  Quick rollback: production (main) back to the site before the looks redesign.
REM  Target: tag prod-before-looks = 58cf21f (production on 2026-10-13, before the
REM  K / M / KM looks and the Horizon logo). Cloudflare Pages rebuilds main on push.
REM
REM  Faster still, no build: Cloudflare dashboard > Workers & Pages > the site > Deployments >
REM  the deployment of 58cf21f > "Rollback to this deployment" (instant).
REM
REM  Run from the repo root:  scripts\rollback-prod.cmd
REM  Undo the rollback later: git push origin looks-live:main --force-with-lease
REM ============================================================================
setlocal
gh auth switch -u mediawave-dev || goto :fail
git fetch origin --tags || goto :fail
REM remember what was live, so the redesign can come back with one push
git tag -f looks-live origin/main
git push origin looks-live --force || goto :fail
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push origin prod-before-looks:main --force-with-lease=main || goto :fail
echo.
echo Done: main is back on prod-before-looks (58cf21f). Cloudflare Pages is rebuilding.
goto :eof
:fail
echo Rollback FAILED. Nothing else was changed. Use the Cloudflare dashboard rollback instead.
exit /b 1
