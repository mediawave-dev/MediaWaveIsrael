$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"
Set-Location "G:\Web-Dev\MediaWaveIsrael"

Write-Host "Stopping Directus..."
docker compose down 2>&1 | Out-Null

Write-Host "Removing database..."
Remove-Item "directus\database\*" -Force -ErrorAction SilentlyContinue

Write-Host "Starting fresh Directus..."
docker compose up -d 2>&1 | Out-Null

$maxWait = 60
$waited = 0
while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 3
    $waited += 3
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8055/server/health" -UseBasicParsing -TimeoutSec 5 2>&1
        if ($response.StatusCode -eq 200) {
            Write-Host "Directus ready! ($waited seconds)"
            exit 0
        }
    } catch {}
    Write-Host "  Waiting... ($waited seconds)"
}
Write-Host "Timeout"
exit 1
