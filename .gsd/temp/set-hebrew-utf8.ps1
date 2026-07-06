[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

$base = 'http://localhost:8055'
$token = 'directus-admin-token'

function Invoke-DirectusPatch {
    param([string]$Url, [string]$JsonBody)

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($JsonBody)
    $request = [System.Net.HttpWebRequest]::Create($Url)
    $request.Method = 'PATCH'
    $request.ContentType = 'application/json; charset=utf-8'
    $request.Headers.Add('Authorization', "Bearer $token")
    $request.ContentLength = $bytes.Length

    $stream = $request.GetRequestStream()
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Close()

    try {
        $response = $request.GetResponse()
        $response.Close()
        return $true
    } catch {
        return $false
    }
}

# Set admin user language
$ok = Invoke-DirectusPatch "$base/users/me" '{"language":"he-IL"}'
Write-Host "Admin language: $(if($ok){'OK'}else{'FAIL'})"

# Collection translations
$cols = @(
    @('blog_posts',    '\u05e4\u05d5\u05e1\u05d8\u05d9\u05dd \u05d1\u05d1\u05dc\u05d5\u05d2')
    @('faqs',          '\u05e9\u05d0\u05dc\u05d5\u05ea \u05e0\u05e4\u05d5\u05e6\u05d5\u05ea')
    @('how_we_work',   '\u05d0\u05d9\u05da \u05d0\u05e0\u05d7\u05e0\u05d5 \u05e2\u05d5\u05d1\u05d3\u05d9\u05dd')
    @('packages',      '\u05d7\u05d1\u05d9\u05dc\u05d5\u05ea')
    @('projects',      '\u05e4\u05e8\u05d5\u05d9\u05e7\u05d8\u05d9\u05dd')
    @('services',      '\u05e9\u05d9\u05e8\u05d5\u05ea\u05d9\u05dd')
    @('site_settings', '\u05d4\u05d2\u05d3\u05e8\u05d5\u05ea \u05d4\u05d0\u05ea\u05e8')
    @('testimonials',  '\u05d4\u05de\u05dc\u05e6\u05d5\u05ea')
    @('why_us',        '\u05dc\u05de\u05d4 \u05d0\u05e0\u05d7\u05e0\u05d5')
)

foreach ($c in $cols) {
    $name = $c[0]
    $he = $c[1]
    $json = "{`"meta`":{`"translations`":[{`"language`":`"he-IL`",`"translation`":`"$he`",`"singular`":`"$he`",`"plural`":`"$he`"}]}}"
    $ok = Invoke-DirectusPatch "$base/collections/$name" $json
    Write-Host "  $(if($ok){'[OK]'}else{'[FAIL]'}) $name"
}

Write-Host "`nDone! Refresh http://localhost:8055"
