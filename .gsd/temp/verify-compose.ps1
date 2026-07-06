$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"
Set-Location "G:\Web-Dev\MediaWaveIsrael"
docker compose config 2>&1
