@echo off
REM This script attempts to close the browser process.
REM It might close all instances of the browser, not just the game window.
REM You might need to change "msedge.exe" to your preferred browser's executable (e.g., "chrome.exe", "firefox.exe").
taskkill /IM msedge.exe /F
exit