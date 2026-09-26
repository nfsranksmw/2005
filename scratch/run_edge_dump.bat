@echo off
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --virtual-time-budget=6000 --dump-dom "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pubhtml?gid=634347005&single=true" > "%~dp0edge_dump.html"
