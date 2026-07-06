# Refresh PATH for docker + claude
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

Set-Location "G:\Web-Dev\MediaWaveIsrael"
& ".\gsd-chain-directus.ps1"
