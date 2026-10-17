@echo off
REM ============================================================================
REM  Quick rollback: production (main) back to the site before the SOTD round (2026-10-17).
REM  Target: tag prod-before-sotd = c718588 (the "one shot" home page released 2026-10-16, with the
REM  inner pages still on the KM palette). Cloudflare Pages rebuilds main on push (about 3-5 minutes).
REM
REM  Faster still, no build: Cloudflare dashboard > Workers & Pages > mediawaveisrael > Deployments >
REM  the production deployment before the SOTD release > "Rollback to this deployment" (instant).
REM
REM  Run from the repo root:  scripts\rollback-sotd.cmd
REM  It pushes as mediawave-dev with a per-command credential helper (no gh auth switch); the gh
REM  keyring must hold mediawave-dev (gh auth token -u mediawave-dev).
REM  Undo the rollback later (the SOTD site comes back):
REM      git push origin sotd-live:main --force-with-lease
REM ============================================================================
setlocal
for /f "delims=" %%t in ('gh auth token -u mediawave-dev') do set "MWTOKEN=%%t"
if "%MWTOKEN%"=="" goto :fail
git fetch origin --tags || goto :fail
REM remember what was live, so the SOTD site can come back with one push
git tag -f sotd-live origin/main
git -c credential.helper= -c "credential.helper=!f() { echo username=mediawave-dev; echo password=%MWTOKEN%; }; f" push origin sotd-live --force || goto :fail
git -c credential.helper= -c "credential.helper=!f() { echo username=mediawave-dev; echo password=%MWTOKEN%; }; f" push origin prod-before-sotd:refs/heads/main --force-with-lease=main || goto :fail
echo.
echo Done: main is back on prod-before-sotd (c718588). Cloudflare Pages is rebuilding.
goto :eof
:fail
echo Rollback FAILED. Nothing else was changed. Use the Cloudflare dashboard rollback instead.
exit /b 1
