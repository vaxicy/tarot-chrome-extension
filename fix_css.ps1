$css = Get-Content "c:\Users\16704\Desktop\tarot\popup.css" -Raw
$css = $css -replace 'transition: all0.3s ease', 'transition: all 0.3s ease'
$css = $css -replace 'transition: left0.5s ease', 'transition: left 0.5s ease'
Set-Content "c:\Users\16704\Desktop\tarot\popup.css" -NoNewline $css
Write-Host "CSS fixed"
