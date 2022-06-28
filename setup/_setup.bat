@echo off
: color settings
for /f %%a in ('echo prompt $e ^| cmd') do set ESC=%%a

: waiting
echo After 5 seconds the installation will begin.
timeout 5

: create directories
echo %ESC%[96mCreating Directories...
set WORKSPACE_PATH = %SystemDrive%\workspace_bot
mkdir %SystemDrive%\workspace_bot
echo %ESC%[92mDone!

echo %ESC%[96mStarting install ...

: winget install
echo %ESC%[97mwinget install packages
winget install --id Volta.Volta
winget install --id Microsoft.VisualStudioCode
winget install --id Git.Git

: force sync path
: https://github.com/microsoft/winget-cli/iss
curl https://raw.githubusercontent.com/chocolatey-archive/chocolatey/master/src/redirects/RefreshEnv.cmd > refresh.cmd
call refresh.cmd
rm refresh.cmd

: nodejs install
volta install node@16

echo %ESC%[92mDone!

: git clone
cd %WORKSPACE_PATH%
git clone https://github.com/kitsunerd/discordbot.git
cd %WORKSPACE_PATH%\discordbot

pause