@echo off
REM ============================================================================
REM  Quick rollback: production (main) back to the site before the "one shot" redesign.
REM  Target: tag prod-before-shot = 412b810 (production on 2026-10-15/16: the KM look with the
REM  lens opener, the iris buttons and the new film). Cloudflare Pages rebuilds main on push
REM  (about 3-4 minutes).
REM
REM  Faster still, no build: Cloudflare dashboard > Workers & Pages > mediawave > Deployments >
REM  the deployment of 412b810 > "Rollback to this deployment" (instant).
REM
REM  Run from the repo root:  scripts\rollback-shot.cmd
REM  Undo the rollback later (the redesign comes back):
REM      git push origin shot-live:main --force-with-lease
REM ============================================================================
setlocal
gh auth switch -u mediawave-dev || goto :fail
git fetch origin --tags || goto :fail
REM remember what was live, so the redesign can come back with one push
git tag -f shot-live origin/main
git push origin shot-live --force || goto :fail
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push origin prod-before-shot:refs/heads/main --force-with-lease=main || goto :fail
echo.
echo Done: main is back on prod-before-shot (412b810). Cloudflare Pages is rebuilding.
goto :eof
:fail
echo Rollback FAILED. Nothing else was changed. Use the Cloudflare dashboard rollback instead.
exit /b 1
