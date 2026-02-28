# ============================================================================
# 🚀 PUSH EXAM SYSTEM TO GITHUB - AUYGOES
# ============================================================================

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     PUSHING EXAM SYSTEM TO GITHUB - auyangon/auygoes         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory (adjust path if needed)
$projectPath = "auygoes"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "📂 Changed to directory: $(Get-Location)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Make sure you're in the right directory" -ForegroundColor Yellow
}

# Check git status
Write-Host ""
Write-Host "📊 Current Git Status:" -ForegroundColor Yellow
git status

# Show what files will be added
Write-Host ""
Write-Host "📦 Files to be added:" -ForegroundColor Cyan
$files = @(
    "src/firebase-exam/",
    "src/types/exam/",
    "src/services/exam/",
    "src/components/Exam/",
    "src/contexts/exam/",
    "src/pages/Exams.tsx",
    "src/pages/Exam/",
    "src/pages/AdminExams.tsx",
    "scripts/exam/"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    }
}

# Confirm push
Write-Host ""
$confirm = Read-Host "Push these files to GitHub? (y/n)"

if ($confirm -eq 'y') {
    # Add files
    Write-Host ""
    Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
    
    git add src/firebase-exam/
    git add src/types/exam/
    git add src/services/exam/
    git add src/components/Exam/
    git add src/contexts/exam/
    git add src/pages/Exams.tsx
    git add src/pages/Exam/
    git add src/pages/AdminExams.tsx
    git add scripts/exam/
    
    # Check if there are changes to commit
    $status = git status --porcelain
    if ($status) {
        # Commit
        $commitMessage = "Add complete exam system with separate Firebase account

- Separate Firebase 'auy-exam' for free tier optimization
- Cheat-proof lockdown with fullscreen enforcement
- Tab switching detection and violation tracking
- Copy/paste prevention and right-click blocking
- Auto-submit on time expiry
- Student results tracking and history
- Admin interface for teachers to manage exams
- Real-time exam monitoring"

        Write-Host ""
        Write-Host "💾 Committing changes..." -ForegroundColor Yellow
        git commit -m $commitMessage
        
        # Push
        Write-Host ""
        Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
        
        # Try main branch first
        git push origin main
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️ Push to main failed, trying master branch..." -ForegroundColor Yellow
            git push origin master
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ SUCCESS! Exam system pushed to GitHub!" -ForegroundColor Green
            Write-Host "   Repository: https://github.com/auyangon/auygoes" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. Checking remote..." -ForegroundColor Red
            
            # Check if remote exists
            $remote = git remote -v
            if (-not $remote) {
                Write-Host "⚠️ No remote repository found." -ForegroundColor Yellow
                $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/auyangon/auygoes.git)"
                if ($repoUrl) {
                    git remote add origin $repoUrl
                    git push -u origin main
                }
            }
        }
    } else {
        Write-Host ""
        Write-Host "⚠️ No changes to commit. Files may already be up to date." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "❌ Push cancelled" -ForegroundColor Red
}

#