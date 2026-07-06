$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

# Test auth with admin token
Write-Host "Testing Bearer token auth..."
$headers = @{
    "Authorization" = "Bearer directus-admin-token"
    "Content-Type" = "application/json"
}
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8055/users/me" -Headers $headers -UseBasicParsing
    Write-Host "Bearer auth result: $($r.StatusCode)"
    Write-Host $r.Content
} catch {
    Write-Host "Bearer auth failed: $($_.Exception.Response.StatusCode.value__)"
}

# Test auth with access_token query param
Write-Host "`nTesting access_token query param..."
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8055/users/me?access_token=directus-admin-token" -UseBasicParsing
    Write-Host "Query param auth result: $($r.StatusCode)"
    Write-Host $r.Content
} catch {
    Write-Host "Query param auth failed: $($_.Exception.Response.StatusCode.value__)"
}

# Test login with email/password
Write-Host "`nTesting login..."
$body = '{"email":"admin@mediawave.co.il","password":"admin123"}'
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8055/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Login result: $($r.StatusCode)"
    $token = ($r.Content | ConvertFrom-Json).data.access_token
    Write-Host "Got JWT token: $($token.Substring(0,20))..."

    # Try using JWT to access collections
    $jwtHeaders = @{ "Authorization" = "Bearer $token" }
    $r2 = Invoke-WebRequest -Uri "http://localhost:8055/items/services" -Headers $jwtHeaders -UseBasicParsing
    Write-Host "Items with JWT: $($r2.StatusCode)"
} catch {
    Write-Host "Login/JWT failed: $_"
}
