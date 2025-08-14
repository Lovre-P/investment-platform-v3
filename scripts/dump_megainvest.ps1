param(
  [Parameter(Mandatory=$true)]
  [string]$Password
)

$ErrorActionPreference = 'Stop'

$dir = 'backups'
if (!(Test-Path $dir)) {
  New-Item -ItemType Directory -Path $dir | Out-Null
}

$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$file = Join-Path $dir ("megainvest_db_${ts}.sql")

# Use env var for password so it is not visible in process list arguments
$Env:MYSQL_PWD = $Password

$mysqldump = 'C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqldump.exe'

& $mysqldump -h 'trolley.proxy.rlwy.net' -P 24595 -u 'root' --databases 'megainvest_db' `
  --single-transaction --set-gtid-purged=OFF --default-character-set=utf8mb4 `
  --routines --events --triggers --skip-comments --result-file=$file

$code = $LASTEXITCODE
Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue

if ($code -ne 0) {
  throw "mysqldump exited with code $code"
}

Write-Output $file

