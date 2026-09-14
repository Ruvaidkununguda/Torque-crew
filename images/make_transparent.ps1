Add-Type -AssemblyName System.Drawing

$inputPath = Join-Path $PSScriptRoot "assets\torque-icon.jpg"
$outputPath = Join-Path $PSScriptRoot "assets\torque-logo-transparent.png"

$bmp = [System.Drawing.Bitmap]::new($inputPath)
$width = $bmp.Width
$height = $bmp.Height

$outBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Find bounding box of non-black pixels
$minX = $width
$maxX = 0
$minY = $height
$maxY = 0

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        $maxC = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
        if ($maxC -ge 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# Add 10px margin
$minX = [Math]::Max(0, $minX - 10)
$maxX = [Math]::Min($width - 1, $maxX + 10)
$minY = [Math]::Max(0, $minY - 10)
$maxY = [Math]::Min($height - 1, $maxY + 10)

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

$croppedBmp = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $cropHeight; $y++) {
    for ($x = 0; $x -lt $cropWidth; $x++) {
        $c = $bmp.GetPixel($minX + $x, $minY + $y)
        $maxC = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
        if ($maxC -lt 16) {
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($maxC -lt 40) {
            $alpha = [int](($maxC - 16) / 24.0 * 255)
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $croppedBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
        }
    }
}

$croppedBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$outBmp.Dispose()
$croppedBmp.Dispose()
Write-Output "SUCCESS: Created $outputPath with dimensions ${cropWidth}x${cropHeight}"
