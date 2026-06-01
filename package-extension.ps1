# 打包脚本 - 创建用于 Chrome Web Store 上传的 ZIP 文件
# 排除开发文件、测试文件和不需要的文件

$ErrorActionPreference = "Stop"

$rootDir = $PSScriptRoot
$outputZip = Join-Path $rootDir "magic-tarot-v1.1.zip"

# 需要排除的文件和目录
$excludePatterns = @(
    "node_modules",
    ".git",
    ".vscode",
    ".idea",
    "*.diff",
    "*.py",
    "*test_*",
    "add_keywords.js",
    "analyze_keywords.js",
    "build_osho.js",
    "gen_*.js",
    "package-extension.js",
    "package-extension.ps1",
    "package.json",
    "screenshots",
    ".gitignore",
    "LICENSE_SETUP.md",
    "*.log",
    "Thumbs.db",
    ".DS_Store"
)

# 需要包含的文件扩展名
$includeExtensions = @(".js", ".html", ".css", ".json", ".png", ".svg")

function ShouldExclude($filePath) {
    $fileName = Split-Path $filePath -Leaf
    $relativePath = $filePath.Substring($rootDir.Length + 1)
    
    foreach ($pattern in $excludePatterns) {
        if ($pattern.Contains("*")) {
            # 简单通配符匹配
            if ($fileName -like $pattern) {
                return $true
            }
        } elseif ($fileName -eq $pattern -or $filePath.Contains($pattern)) {
            return $true
        }
    }
    
    return $false
}

function CreatePackage {
    Write-Host "🚀 开始打包 Chrome 扩展..." -ForegroundColor Cyan
    Write-Host ""
    
    # 删除旧的 ZIP 文件
    if (Test-Path $outputZip) {
        Remove-Item $outputZip -Force
        Write-Host "🗑️  删除旧的 ZIP 文件" -ForegroundColor Yellow
    }
    
    # 创建临时目录
    $tempDir = Join-Path $rootDir "temp_package"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # 复制文件
    $fileCount = 0
    $dirCount = 0
    
    Get-ChildItem -Path $rootDir -Recurse | ForEach-Object {
        $fullPath = $_.FullName
        $relativePath = $fullPath.Substring($rootDir.Length + 1)
        
        if (ShouldExclude $fullPath) {
            Write-Host "⏭️  跳过: $relativePath" -ForegroundColor Gray
            return
        }
        
        if ($_.PSIsContainer) {
            # 目录
            $targetDir = Join-Path $tempDir $relativePath
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir | Out-Null
            }
            Write-Host "📁 添加目录: $relativePath" -ForegroundColor Green
            $dirCount++
        } else {
            # 文件
            $ext = [System.IO.Path]::GetExtension($_.Name)
            if ($includeExtensions -contains $ext -or $_.Name -eq "manifest.json") {
                $targetFile = Join-Path $tempDir $relativePath
                $targetDir = Split-Path $targetFile -Parent
                if (-not (Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir | Out-Null
                }
                Copy-Item $fullPath $targetFile
                Write-Host "📄 添加文件: $relativePath" -ForegroundColor Blue
                $fileCount++
            }
        }
    }
    
    # 创建 ZIP 文件
    Write-Host ""
    Write-Host "📦 正在创建 ZIP 文件..." -ForegroundColor Cyan
    Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -CompressionLevel Optimal
    
    # 清理临时目录
    Remove-Item $tempDir -Recurse -Force
    
    # 获取文件大小
    $fileSize = (Get-Item $outputZip).Length
    $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
    
    Write-Host ""
    Write-Host "✅ 打包完成！" -ForegroundColor Green
    Write-Host "📦 文件大小: $fileSizeMB MB" -ForegroundColor Yellow
    Write-Host "📍 输出文件: $outputZip" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🚀 下一步：" -ForegroundColor Cyan
    Write-Host "1. 访问 https://chrome.google.com/webstore/devconsole/"
    Write-Host "2. 登录开发者账号"
    Write-Host "3. 点击""上传新版本""或""新建项目"""
    Write-Host "4. 上传 magic-tarot-v1.1.zip"
    Write-Host ""
    Write-Host "📊 统计信息：" -ForegroundColor Cyan
    Write-Host "   - 文件数量: $fileCount"
    Write-Host "   - 目录数量: $dirCount"
}

CreatePackage
