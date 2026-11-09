# Installs Dwello on Windows 10 or 11 (#579). Paste into PowerShell (Start menu, «PowerShell»):
#   irm https://raw.githubusercontent.com/rudini/Dwello/main/install/windows.ps1 | iex
# It installs WSL2 and Docker Desktop if they are missing (Windows asks for administrator rights, and after WSL2 for a
# restart: then paste the line again, it continues), puts Dwello into %USERPROFILE%\dwello, starts it and opens the
# browser at the setup. Run it again to update Dwello; the data stays. The steps by hand: docs/installation.md.
& {
	$source = if ($env:DWELLO_SOURCE) { $env:DWELLO_SOURCE } else { 'https://raw.githubusercontent.com/rudini/Dwello/main' }
	$dir = Join-Path $HOME 'dwello'
	# no $ErrorActionPreference = 'Stop': Windows PowerShell 5.1 would stop on any line docker writes to stderr
	function Say($text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
	function Stop-Install($what, $todo) { throw "$what`nWhat to do: $todo" }
	function Invoke-Docker { & docker @args; if ($LASTEXITCODE -ne 0) { Stop-Install "docker $args failed (its message is above)." 'fix what it names, then paste the line again.' } }
	function Test-Docker { if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { return $false }; & docker info *> $null; $LASTEXITCODE -eq 0 }
	$env:Path += ";$env:ProgramFiles\Docker\Docker\resources\bin"

	try {
		if (-not (Test-Docker)) {
			if (-not (Test-Path "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe")) {
				& wsl.exe --status *> $null
				if ($LASTEXITCODE -ne 0) {
					Say 'Installing WSL2, which Docker needs. Windows asks for administrator rights.'
					$wsl = Start-Process wsl.exe -ArgumentList '--install', '--no-distribution' -Verb RunAs -Wait -PassThru -ErrorAction Stop
					if ($wsl.ExitCode -notin 0, 3010) { Stop-Install 'WSL2 was not installed (the message is in its window).' 'run Windows Update, then paste the line again.' }
					Say 'Restart Windows now, then open PowerShell and paste the line again: it continues here.'
					return
				}
				if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
					Stop-Install 'winget is missing.' 'install «App Installer» from the Microsoft Store, then paste the line again.'
				}
				Say 'Installing Docker Desktop with winget. Windows asks for administrator rights.'
				& winget install --exact --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
				if ($LASTEXITCODE -ne 0) { Stop-Install 'Docker Desktop was not installed (the message is above).' 'restart Windows, then paste the line again.' }
			}
			Say 'Starting Docker Desktop. The first time, accept its terms in its window (no account needed); this script waits.'
			Start-Process "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe" -ErrorAction Stop
			$until = (Get-Date).AddMinutes(10)
			while (-not (Test-Docker) -and (Get-Date) -lt $until) { Start-Sleep 3 }
			if (-not (Test-Docker)) {
				Stop-Install 'Docker Desktop does not run after 10 minutes.' 'restart Windows, open Docker Desktop, accept its terms and wait until it says «Engine running», then paste the line again.'
			}
		}

		if (Test-Path (Join-Path $dir '.git')) { Stop-Install "$dir is a Git clone of Dwello." 'update it as docs/installation.md, «From a clone», says.' }
		Say "Downloading Dwello into $dir."
		New-Item -ItemType Directory -Force $dir -ErrorAction Stop | Out-Null
		Set-Location $dir -ErrorAction Stop
		Invoke-WebRequest -UseBasicParsing "$source/compose.yaml" -OutFile compose.yaml -ErrorAction Stop

		Say 'Starting Dwello. The first time this downloads about 4 GB and takes a few minutes.'
		Invoke-Docker compose pull --quiet
		Invoke-Docker compose up -d
		Invoke-Docker compose up -d --wait --wait-timeout 600 frontend

		$code = & docker logs dwello-backend 2>&1 | Select-String 'Einrichtungscode: ([A-Z0-9-]+)' | Select-Object -Last 1
		Say 'Dwello runs at http://localhost:3000 and opens in the browser.'
		# only while the setup is still open: the log keeps an older code after the setup
		$open = try { (Invoke-WebRequest -UseBasicParsing -MaximumRedirection 0 'http://localhost:3000/setup' -ErrorAction Stop).StatusCode -eq 200 } catch { $false }
		if ($code -and $open) { Say "Einrichtungscode for «Dwello einrichten»: $($code.Matches[0].Groups[1].Value)" }
		Start-Process 'http://localhost:3000'
	} catch {
		$text = $_.Exception.Message
		if ($text -notmatch 'What to do:') { $text += "`nWhat to do: fix what the message names (for example the internet connection), then paste the line again." }
		Write-Host "`nDwello installation stopped: $text`nHelp: https://github.com/rudini/Dwello/blob/main/docs/installation.md" -ForegroundColor Red
	}
}
