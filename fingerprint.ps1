# Fingerprint local CSS and JS files with content-based hashes
# Run this script after modifying css/styles.css, js/scripts.js, or js/site.js

$rootPath = $PSScriptRoot

# Files to fingerprint (relative paths)
$filesToFingerprint = @(
    "css/styles.css",
    "js/scripts.js",
    "js/site.js"
)

# HTML files to update
$htmlFiles = Get-ChildItem -Path $rootPath -Filter "*.html"

# Calculate short hash for each file
$fingerprints = @{}
foreach ($file in $filesToFingerprint) {
    $fullPath = Join-Path $rootPath $file
    if (Test-Path $fullPath) {
        $hash = (Get-FileHash -Path $fullPath -Algorithm MD5).Hash.Substring(0, 8).ToLower()
        $fingerprints[$file] = $hash
        Write-Host "  $file -> $hash" -ForegroundColor Cyan
    } else {
        Write-Warning "File not found: $fullPath"
    }
}

# Update each HTML file
foreach ($htmlFile in $htmlFiles) {
    $content = Get-Content -Path $htmlFile.FullName -Raw
    $modified = $false
    
    foreach ($file in $filesToFingerprint) {
        $fileName = [System.IO.Path]::GetFileName($file)
        $dirName = [System.IO.Path]::GetDirectoryName($file).Replace("\", "/")
        $hash = $fingerprints[$file]
        
        # Pattern to match the file reference with or without existing query string
        $pattern = "(?<prefix>(`"$dirName/$fileName|'$dirName/$fileName))(\?v=[a-f0-9]+)?(?<suffix>`"|')"
        $replacement = "`${prefix}?v=$hash`${suffix}"
        
        $newContent = [regex]::Replace($content, $pattern, $replacement)
        if ($newContent -ne $content) {
            $content = $newContent
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $htmlFile.FullName -Value $content -NoNewline
        Write-Host "Updated: $($htmlFile.Name)" -ForegroundColor Green
    } else {
        Write-Host "No changes: $($htmlFile.Name)" -ForegroundColor Gray
    }
}

Write-Host "`nFingerprinting complete!" -ForegroundColor Green
