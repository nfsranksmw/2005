$body = @{
    test = "ok"
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "https://nfsranks-blacklist-default-rtdb.firebaseio.com/submissions/test_connection.json" -Method Put -Body $body -ContentType "application/json"
    Write-Host "Firebase PUT SUCCESS:" ($res | ConvertTo-Json -Compress)
} catch {
    Write-Host "Firebase PUT FAILED:" $_.Exception.Message
}
