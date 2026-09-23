$gasUrl = 'https://script.google.com/macros/s/AKfycbzi0i3UMk4nywlcJlCX_leHJBjEJZ0a-gkAA_rTl2Q6B0iL7EglOLLVyPyoiZMagBQQ/exec'
$fbBase = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'

Write-Host "--- 1. Testing Google Apps Script ---"
try {
    $res = Invoke-WebRequest -Uri $gasUrl -Method GET -MaximumRedirection 5
    Write-Host "GAS GET Status: $($res.StatusCode)"
    Write-Host "GAS GET Content: $($res.Content)"
} catch {
    Write-Host "GAS GET Exception: $($_.Exception.Message)"
}

Write-Host "--- 2. Testing Firebase RTDB Leaderboards Read ---"
try {
    $fbRes = Invoke-WebRequest -Uri "$fbBase/leaderboards.json" -Method GET
    Write-Host "Firebase Leaderboards Status: $($fbRes.StatusCode)"
    Write-Host "Firebase Leaderboards Content: $($fbRes.Content)"
} catch {
    Write-Host "Firebase Leaderboards Exception: $($_.Exception.Message)"
}

Write-Host "--- 3. Testing Firebase RTDB Submissions Queue ---"
try {
    $subRes = Invoke-WebRequest -Uri "$fbBase/submissions.json" -Method GET
    Write-Host "Firebase Submissions Status: $($subRes.StatusCode)"
    Write-Host "Firebase Submissions Content: $($subRes.Content)"
} catch {
    Write-Host "Firebase Submissions Exception: $($_.Exception.Message)"
}

Write-Host "--- 4. Testing Firebase RTDB Championship Participants ---"
try {
    $partRes = Invoke-WebRequest -Uri "$fbBase/championship_participants.json" -Method GET
    Write-Host "Firebase Participants Status: $($partRes.StatusCode)"
    Write-Host "Firebase Participants Content: $($partRes.Content)"
} catch {
    Write-Host "Firebase Participants Exception: $($_.Exception.Message)"
}
