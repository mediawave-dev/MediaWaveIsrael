$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

$token = "directus-admin-token"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Check roles
Write-Host "Checking roles..."
$r = Invoke-WebRequest -Uri "http://localhost:8055/roles?access_token=$token" -UseBasicParsing
Write-Host $r.Content

# Check policies
Write-Host "`nChecking policies..."
$r = Invoke-WebRequest -Uri "http://localhost:8055/policies?access_token=$token" -UseBasicParsing
Write-Host $r.Content

# Check permissions
Write-Host "`nChecking permissions..."
$r = Invoke-WebRequest -Uri "http://localhost:8055/permissions?access_token=$token" -UseBasicParsing
$perms = ($r.Content | ConvertFrom-Json).data
Write-Host "Total permissions: $($perms.Count)"
if ($perms.Count -gt 0) {
    $perms | Select-Object -First 5 | ForEach-Object { Write-Host "  collection=$($_.collection), action=$($_.action), policy=$($_.policy)" }
}
