# ============================================================================
# Copy AI Industrial Transition report assets into the labs site
# ============================================================================
# Run this once from PowerShell. It copies:
#   - PDF  -> public/downloads/  AND  ../Research Reports/  (for sync-meta)
#   - docx -> public/downloads/
#   - cover.jpg -> public/covers/
#   - 30 SVG figures -> public/figures/india-ai-industrial-transition-2026-2035/
# ============================================================================

$ErrorActionPreference = "Stop"

$RepoRoot   = "D:\techadyant\labs\techadyant_labs-main"
$LabsRoot   = "D:\techadyant\labs"
$SourceDir  = Join-Path $LabsRoot "Reports and DPR\India`u{2019}s AI Industrial Transition and Infrastructure Transformation (2026`u{2013}2035)"
$Slug       = "india-ai-industrial-transition-2026-2035"

# --- Resolve source paths (the folder name uses curly apostrophe and en-dash) ---
if (-not (Test-Path -LiteralPath $SourceDir)) {
    # Fallback: find the folder by pattern
    $SourceDir = Get-ChildItem -LiteralPath (Join-Path $LabsRoot "Reports and DPR") -Directory |
                 Where-Object { $_.Name -like "*AI Industrial Transition*" } |
                 Select-Object -First 1 -ExpandProperty FullName
    if (-not $SourceDir) { throw "Could not find the AI Industrial Transition source folder under 'Reports and DPR'." }
}
Write-Host "Source folder: $SourceDir" -ForegroundColor Cyan

$SrcPdf    = Get-ChildItem -LiteralPath $SourceDir -Filter "*.pdf"  | Select-Object -First 1 -ExpandProperty FullName
$SrcDocx   = Get-ChildItem -LiteralPath $SourceDir -Filter "*.docx" |
             Where-Object { $_.Name -notlike "*editorial*" } |
             Select-Object -First 1 -ExpandProperty FullName
$SrcJpg    = Get-ChildItem -LiteralPath $SourceDir -Filter "*.jpg"  | Select-Object -First 1 -ExpandProperty FullName
# Prefer text-as-text SVGs (matplotlib svg.fonttype='none' output) under
# Visuals_editable_text/Visuals/. Fall back to original outlined-path SVGs.
$SrcVisualsEditable = Join-Path $SourceDir "Visuals_editable_text\Visuals"
$SrcVisualsOriginal = Join-Path $SourceDir "Visuals"
if (Test-Path -LiteralPath $SrcVisualsEditable) {
    $SrcVisuals = $SrcVisualsEditable
    Write-Host "Using text-as-text SVGs from Visuals_editable_text/" -ForegroundColor Green
} else {
    $SrcVisuals = $SrcVisualsOriginal
    Write-Host "Using outlined-path SVGs from Visuals/" -ForegroundColor Yellow
}

if (-not (Test-Path -LiteralPath $SrcPdf))    { throw "Missing source PDF in $SourceDir" }
if (-not (Test-Path -LiteralPath $SrcDocx))   { throw "Missing source docx in $SourceDir" }
if (-not (Test-Path -LiteralPath $SrcVisuals)){ throw "Missing Visuals/ folder in $SourceDir" }

# --- Ensure target directories exist ---
$DownloadsDir = Join-Path $RepoRoot "public\downloads"
$CoversDir    = Join-Path $RepoRoot "public\covers"
$FiguresDir   = Join-Path $RepoRoot "public\figures\$Slug"
$ResearchDir  = Join-Path $LabsRoot "Research Reports"
New-Item -ItemType Directory -Force -Path $DownloadsDir | Out-Null
New-Item -ItemType Directory -Force -Path $CoversDir    | Out-Null
New-Item -ItemType Directory -Force -Path $FiguresDir   | Out-Null
New-Item -ItemType Directory -Force -Path $ResearchDir  | Out-Null

# --- 1. PDF -> public/downloads AND Research Reports (for sync-meta) ---
$DestPdf      = Join-Path $DownloadsDir "$Slug.pdf"
$DestPdfMeta  = Join-Path $ResearchDir  "$Slug.pdf"
Copy-Item -LiteralPath $SrcPdf -Destination $DestPdf     -Force
Copy-Item -LiteralPath $SrcPdf -Destination $DestPdfMeta -Force
Write-Host "OK  PDF  -> $DestPdf"
Write-Host "OK  PDF  -> $DestPdfMeta (for npm run sync-meta)"

# --- 2. docx -> public/downloads ---
$DestDocx = Join-Path $DownloadsDir "$Slug.docx"
Copy-Item -LiteralPath $SrcDocx -Destination $DestDocx -Force
Write-Host "OK  docx -> $DestDocx"

# --- 3. cover JPG -> public/covers (only if a JPG exists) ---
if ($SrcJpg) {
    $DestJpg = Join-Path $CoversDir "$Slug.jpg"
    Copy-Item -LiteralPath $SrcJpg -Destination $DestJpg -Force
    Write-Host "OK  cover -> $DestJpg"
} else {
    Write-Host "skip cover (no .jpg in source) - ReportCover will render the branded fallback"
}

# --- 4. 30 SVG figures -> public/figures/<slug>/ ---
$Svgs = Get-ChildItem -LiteralPath $SrcVisuals -Filter "*.svg"
$count = 0
foreach ($svg in $Svgs) {
    Copy-Item -LiteralPath $svg.FullName -Destination (Join-Path $FiguresDir $svg.Name) -Force
    $count++
}
Write-Host "OK  $count SVG figures -> $FiguresDir"

# --- Also copy the PNG fallbacks from the ORIGINAL Visuals/ folder ---
# (Visuals_editable_text only contains SVGs; PNGs always live alongside the originals.)
$Pngs = Get-ChildItem -LiteralPath $SrcVisualsOriginal -Filter "*.png" -ErrorAction SilentlyContinue
$pcount = 0
foreach ($png in $Pngs) {
    Copy-Item -LiteralPath $png.FullName -Destination (Join-Path $FiguresDir $png.Name) -Force
    $pcount++
}
if ($pcount -gt 0) { Write-Host "OK  $pcount PNG fallbacks -> $FiguresDir" }

Write-Host ""
Write-Host "Done. Next steps:" -ForegroundColor Green
Write-Host "  cd $RepoRoot"
Write-Host "  npm run sync-meta"
Write-Host "  npm run build"
