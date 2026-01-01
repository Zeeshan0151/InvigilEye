; InvigilEye - Python AI Bundle Downloader for NSIS
; This script is included in the main installer to download Python during installation

!define PYTHON_DOWNLOAD_URL "https://github.com/Zeeshan0151/InvigilEye/releases/download/v1.0.0-python/python-portable.tar.gz"

Section "DownloadPython" SEC_PYTHON
  SetOutPath "$TEMP\InvigilEye"
  
  DetailPrint "=========================================="
  DetailPrint "Downloading AI Bundle (600MB)"
  DetailPrint "This may take a few minutes..."
  DetailPrint "=========================================="
  
  ; Use NSISdl plugin to download with progress
  NSISdl::download /TIMEOUT=30000 "${PYTHON_DOWNLOAD_URL}" "$TEMP\InvigilEye\python-portable.tar.gz"
  Pop $R0
  
  ${If} $R0 == "success"
    DetailPrint "✓ Download completed successfully"
    
    ; Check if file exists and has reasonable size (> 100MB)
    ${If} ${FileExists} "$TEMP\InvigilEye\python-portable.tar.gz"
      DetailPrint "✓ File verified"
      
      ; Create destination directory
      CreateDirectory "$APPDATA\InvigilEye\python-portable"
      
      ; Move the file to AppData for later extraction
      DetailPrint "Moving Python bundle to AppData..."
      CopyFiles "$TEMP\InvigilEye\python-portable.tar.gz" "$APPDATA\InvigilEye\python-portable.tar.gz"
      
      ; Mark that Python needs extraction on first run
      FileOpen $0 "$APPDATA\InvigilEye\.python-pending" w
      FileWrite $0 "Downloaded: $TEMP\InvigilEye\python-portable.tar.gz"
      FileClose $0
      
      DetailPrint "✓ Python bundle will be extracted on first launch"
      
      ; Clean up temp
      Delete "$TEMP\InvigilEye\python-portable.tar.gz"
    ${Else}
      DetailPrint "✗ Downloaded file not found"
    ${EndIf}
  ${Else}
    DetailPrint "✗ Download failed: $R0"
    MessageBox MB_ICONINFORMATION \
      "Could not download AI bundle during installation.$\r$\n$\r$\nInvigilEye will download it automatically on first launch when connected to the internet."
  ${EndIf}
  
  RMDir "$TEMP\InvigilEye"
SectionEnd

