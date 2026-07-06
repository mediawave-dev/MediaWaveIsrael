$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

$token = "directus-admin-token"

# List all collections (to verify they exist)
Write-Host "Listing custom collections..."
$r = Invoke-WebRequest -Uri "http://localhost:8055/collections?access_token=$token" -UseBasicParsing
$cols = ($r.Content | ConvertFrom-Json).data | Where-Object { -not $_.collection.StartsWith("directus_") } | ForEach-Object { $_.collection }
Write-Host "Custom collections: $($cols -join ', ')"

# Try to read items from services
Write-Host "`nReading services..."
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8055/items/services?access_token=$token" -UseBasicParsing
    Write-Host "Success: $($r.Content)"
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    Write-Host "Failed ($status). Trying with admin credentials via login..."

    # Login and get fresh JWT
    $body = '{"email":"admin@mediawave.co.il","password":"admin123"}'
    $lr = Invoke-WebRequest -Uri "http://localhost:8055/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $jwt = ($lr.Content | ConvertFrom-Json).data.access_token

    # Try with JWT
    $jwtHeaders = @{ "Authorization" = "Bearer $jwt"; "Content-Type" = "application/json" }
    try {
        $r2 = Invoke-WebRequest -Uri "http://localhost:8055/items/services" -Headers $jwtHeaders -UseBasicParsing
        Write-Host "JWT read success: $($r2.Content)"
    } catch {
        Write-Host "JWT read also failed: $($_.Exception.Response.StatusCode.value__)"

        # Try creating item with JWT
        Write-Host "`nTrying to create item with JWT..."
        $item = '{"title":"test","description":"test"}'
        try {
            $r3 = Invoke-WebRequest -Uri "http://localhost:8055/items/services" -Method POST -Headers $jwtHeaders -Body $item -UseBasicParsing
            Write-Host "Create success: $($r3.Content)"
        } catch {
            Write-Host "Create failed: $($_.Exception.Response.StatusCode.value__)"
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host $reader.ReadToEnd()
        }
    }
}

# Check if collection needs schema/access setup
Write-Host "`nChecking collection metadata..."
$r = Invoke-WebRequest -Uri "http://localhost:8055/collections/services?access_token=$token" -UseBasicParsing
Write-Host $r.Content
