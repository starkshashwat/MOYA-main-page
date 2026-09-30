# Optional asset regeneration on Windows; generated images are committed.
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$source = [System.Drawing.Image]::FromFile((Join-Path $root 'assets/savan-desktop.png'))
foreach ($width in @(640, 1100)) {
  $height = [int][Math]::Round($source.Height * $width / $source.Width)
  $image = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($image)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($source, 0, 0, $width, $height)
  $image.Save((Join-Path $root "assets/savan-$width.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $image.Dispose()
}
$canvas = New-Object System.Drawing.Bitmap(1200, 630)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::FromArgb(6, 6, 8))
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$violet = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(157, 101, 255))
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(242, 241, 232))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(197, 187, 212))
$title = New-Object System.Drawing.Font('Arial', 82, [System.Drawing.FontStyle]::Bold)
$sub = New-Object System.Drawing.Font('Arial', 32, [System.Drawing.FontStyle]::Regular)
$small = New-Object System.Drawing.Font('Arial', 20, [System.Drawing.FontStyle]::Regular)
$g.FillRectangle($violet, 64, 64, 96, 8)
$g.DrawString('MOYA', $title, $white, 56, 100)
$g.DrawString('ACADEMY', $sub, $violet, 68, 239)
$g.DrawString('The Mechanism of', $sub, $white, 68, 342)
$g.DrawString('YouTube Automation', $sub, $white, 68, 395)
$g.DrawString('mechanismofya.com', $small, $muted, 68, 529)
$g.DrawImage($source, 625, 130, 790, 445)
$canvas.Save((Join-Path $root 'assets/moya-social.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg)
@($source, $g, $canvas, $violet, $white, $muted, $title, $sub, $small) | ForEach-Object { $_.Dispose() }
