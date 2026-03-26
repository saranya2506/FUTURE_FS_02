@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"

echo Initializing repository...
%GIT% init

echo Adding remote origin...
%GIT% remote remove origin 2>nul
%GIT% remote add origin https://github.com/saranya2506/FUTURE_FS_02.git

echo Adding files...
%GIT% add .

echo Committing...
%GIT% commit -m "Final CRM project"

echo Branching main...
%GIT% branch -M main

echo Pushing to GitHub (this may prompt you for credentials)...
%GIT% push -u origin main

echo Push process complete!
