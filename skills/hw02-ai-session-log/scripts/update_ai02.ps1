param(
    [Parameter(Mandatory = $true)]
    [string]$AuditDocx,

    [Parameter(Mandatory = $true)]
    [ValidatePattern('^ART[0-9]{3,}$')]
    [string]$ArtifactId,

    [Parameter(Mandatory = $true)]
    [string]$PromptTool,

    [Parameter(Mandatory = $true)]
    [string]$AiOutput,

    [Parameter(Mandatory = $true)]
    [ValidateSet('VALID', 'INVALID', 'INCOMPLETE', 'PENDING HUMAN REVIEW')]
    [string]$Verdict,

    [Parameter(Mandatory = $true)]
    [string]$Reasoning,

    [Parameter(Mandatory = $true)]
    [string]$StudentFix
)

$ErrorActionPreference = 'Stop'
$wordNamespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$xmlNamespace = 'http://www.w3.org/XML/1998/namespace'

function Get-CellText {
    param(
        [System.Xml.XmlNode]$Cell,
        [System.Xml.XmlNamespaceManager]$NamespaceManager
    )

    $parts = $Cell.SelectNodes('.//w:t', $NamespaceManager) | ForEach-Object { $_.InnerText }
    return (($parts -join ' ') -replace '\s+', ' ').Trim()
}

function Set-CellText {
    param(
        [System.Xml.XmlDocument]$Document,
        [System.Xml.XmlNode]$Cell,
        [string]$Value
    )

    $properties = $Cell.SelectSingleNode('./w:tcPr', $script:namespaceManager)
    $children = @($Cell.ChildNodes)
    foreach ($child in $children) {
        if ($null -eq $properties -or -not [object]::ReferenceEquals($child, $properties)) {
            [void]$Cell.RemoveChild($child)
        }
    }

    $paragraph = $Document.CreateElement('w', 'p', $script:wordNamespace)
    $run = $Document.CreateElement('w', 'r', $script:wordNamespace)
    $text = $Document.CreateElement('w', 't', $script:wordNamespace)
    $space = $Document.CreateAttribute('xml', 'space', $script:xmlNamespace)
    $space.Value = 'preserve'
    [void]$text.Attributes.Append($space)
    $text.InnerText = $Value
    [void]$run.AppendChild($text)
    [void]$paragraph.AppendChild($run)
    [void]$Cell.AppendChild($paragraph)
}

function Set-SummaryValue {
    param(
        [System.Xml.XmlDocument]$Document,
        [System.Xml.XmlNode]$Row,
        [int]$CellIndex,
        [string]$Value
    )

    $cells = $Row.SelectNodes('./w:tc', $script:namespaceManager)
    Set-CellText -Document $Document -Cell $cells[$CellIndex] -Value $Value
}

$resolvedPath = (Resolve-Path -LiteralPath $AuditDocx).Path
if ([System.IO.Path]::GetExtension($resolvedPath) -ne '.docx') {
    throw 'AuditDocx must be a .docx file.'
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempPath = Join-Path ([System.IO.Path]::GetTempPath()) ("hw02-ai02-{0}.docx" -f [guid]::NewGuid())
Copy-Item -LiteralPath $resolvedPath -Destination $tempPath

try {
    $archive = [System.IO.Compression.ZipFile]::Open($tempPath, [System.IO.Compression.ZipArchiveMode]::Update)
    try {
        $entry = $archive.GetEntry('word/document.xml')
        if ($null -eq $entry) {
            throw 'word/document.xml was not found in the DOCX file.'
        }

        $reader = [System.IO.StreamReader]::new($entry.Open())
        try {
            $xmlText = $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
        }

        $document = [System.Xml.XmlDocument]::new()
        $document.PreserveWhitespace = $true
        $document.LoadXml($xmlText)
        $script:wordNamespace = $wordNamespace
        $script:xmlNamespace = $xmlNamespace
        $script:namespaceManager = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
        $script:namespaceManager.AddNamespace('w', $wordNamespace)

        $tables = $document.SelectNodes('//w:tbl', $script:namespaceManager)
        if ($tables.Count -lt 3) {
            throw 'The expected AI-02 tables were not found.'
        }

        $auditTable = $tables[1]
        $rows = @($auditTable.SelectNodes('./w:tr', $script:namespaceManager))
        $targetRow = $null
        $blankRow = $null

        foreach ($row in $rows) {
            $cells = $row.SelectNodes('./w:tc', $script:namespaceManager)
            if ($cells.Count -ne 5) { continue }

            $first = Get-CellText -Cell $cells[0] -NamespaceManager $script:namespaceManager
            if ($first -match [regex]::Escape($ArtifactId)) {
                $targetRow = $row
                break
            }

            if ($null -eq $blankRow -and $first -match '^Artifact #[0-9]+$') {
                $otherText = for ($index = 1; $index -lt 5; $index++) {
                    Get-CellText -Cell $cells[$index] -NamespaceManager $script:namespaceManager
                }
                if (($otherText -join '').Length -eq 0) {
                    $blankRow = $row
                }
            }
        }

        if ($null -eq $targetRow) {
            $targetRow = $blankRow
        }

        if ($null -eq $targetRow) {
            $templateRow = $rows[$rows.Count - 1]
            $targetRow = $templateRow.CloneNode($true)
            [void]$auditTable.AppendChild($targetRow)
        }

        $targetCells = $targetRow.SelectNodes('./w:tc', $script:namespaceManager)
        $values = @(
            "$ArtifactId`n$PromptTool",
            $AiOutput,
            $Verdict,
            $Reasoning,
            $StudentFix
        )
        for ($index = 0; $index -lt 5; $index++) {
            Set-CellText -Document $document -Cell $targetCells[$index] -Value $values[$index]
        }

        $counts = @{ VALID = 0; INVALID = 0; INCOMPLETE = 0 }
        $artifactRows = @($auditTable.SelectNodes('./w:tr', $script:namespaceManager))
        foreach ($row in $artifactRows) {
            $cells = $row.SelectNodes('./w:tc', $script:namespaceManager)
            if ($cells.Count -ne 5) { continue }
            $first = Get-CellText -Cell $cells[0] -NamespaceManager $script:namespaceManager
            if ($first -notmatch '^ART[0-9]{3,}') { continue }
            $rowVerdict = Get-CellText -Cell $cells[2] -NamespaceManager $script:namespaceManager
            if ($counts.ContainsKey($rowVerdict)) {
                $counts[$rowVerdict]++
            }
        }

        $total = $counts.VALID + $counts.INVALID + $counts.INCOMPLETE
        $summaryRows = @($tables[2].SelectNodes('./w:tr', $script:namespaceManager))
        Set-SummaryValue -Document $document -Row $summaryRows[1] -CellIndex 1 -Value ([string]$total)
        for ($index = 0; $index -lt 3; $index++) {
            $key = @('VALID', 'INVALID', 'INCOMPLETE')[$index]
            $count = $counts[$key]
            $percentage = if ($total -eq 0) { '0%' } else { '{0:0.##}%' -f (($count * 100.0) / $total) }
            Set-SummaryValue -Document $document -Row $summaryRows[$index + 2] -CellIndex 1 -Value ([string]$count)
            Set-SummaryValue -Document $document -Row $summaryRows[$index + 2] -CellIndex 2 -Value $percentage
        }

        $settings = [System.Xml.XmlWriterSettings]::new()
        $settings.Encoding = [System.Text.UTF8Encoding]::new($false)
        $settings.Indent = $false
        $memory = [System.IO.MemoryStream]::new()
        $writer = [System.Xml.XmlWriter]::Create($memory, $settings)
        try {
            $document.Save($writer)
            $writer.Flush()
        }
        finally {
            $writer.Dispose()
        }

        $entry.Delete()
        $newEntry = $archive.CreateEntry('word/document.xml')
        $stream = $newEntry.Open()
        try {
            $bytes = $memory.ToArray()
            $stream.Write($bytes, 0, $bytes.Length)
        }
        finally {
            $stream.Dispose()
            $memory.Dispose()
        }
    }
    finally {
        $archive.Dispose()
    }

    Move-Item -LiteralPath $tempPath -Destination $resolvedPath -Force
    Write-Output "Updated $resolvedPath for $ArtifactId with verdict '$Verdict'."
}
catch {
    if (Test-Path -LiteralPath $tempPath) {
        Remove-Item -LiteralPath $tempPath -Force
    }
    throw
}
