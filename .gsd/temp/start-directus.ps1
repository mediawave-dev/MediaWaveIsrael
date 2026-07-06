$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"
Set-Location "G:\Web-Dev\MediaWaveIsrael"
Write-Host "Starting Directus..."
docker compose up -d 2>&1
Write-Host "Waiting for Directus to be ready..."
$maxWait = 60
$waited = 0
while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 3
    $waited += 3
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8055/server/health" -UseBasicParsing -TimeoutSec 5 2>&1
        if ($response.StatusCode -eq 200) {
            Write-Host "Directus is ready! (took $waited seconds)"
            exit 0
        }
    } catch {}
    Write-Host "  Waiting... ($waited seconds)"
}
Write-Host "Timeout waiting for Directus."
exit 1
