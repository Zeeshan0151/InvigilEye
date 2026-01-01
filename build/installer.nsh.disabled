; Custom NSIS installer script for InvigilEye
; This script downloads Python AI bundle during installation

!include "MUI2.nsh"
!include "LogicLib.nsh"

; Download the INetC plugin for downloading files
; Documentation: https://nsis.sourceforge.io/Inetc_plug-in

!define PYTHON_DOWNLOAD_URL "https://github.com/Zeeshan0151/InvigilEye/releases/download/v1.0.0-python/python-portable.tar.gz"
!define PYTHON_BUNDLE_SIZE "600MB"

; Custom page for Python download
Page custom PythonDownloadPage PythonDownloadLeave

Var PythonDownloadDialog
Var PythonDownloadLabel
Var PythonProgressBar
Var PythonDownloadSuccess

Function PythonDownloadPage
  !insertmacro MUI_HEADER_TEXT "AI Features Setup" "Downloading pose detection AI model..."
  
  nsDialogs::Create 1018
  Pop $PythonDownloadDialog
  
  ${If} $PythonDownloadDialog == error
    Abort
  ${EndIf}
  
  ; Title label
  ${NSD_CreateLabel} 0 0 100% 20u "Setting up AI pose detection capabilities..."
  Pop $0
  
  ; Info label
  ${NSD_CreateLabel} 0 25u 100% 30u "InvigilEye uses advanced AI for real-time monitoring. We're downloading the required models and dependencies (${PYTHON_BUNDLE_SIZE}).$\r$\n$\r$\nThis is a one-time download and will only take a few minutes."
  Pop $1
  
  ; Progress label
  ${NSD_CreateLabel} 0 60u 100% 12u "Download progress:"
  Pop $PythonDownloadLabel
  
  ; Progress bar
  ${NSD_CreateProgressBar} 0 75u 100% 12u ""
  Pop $PythonProgressBar
  
  ; Status label
  ${NSD_CreateLabel} 0 92u 100% 12u "Preparing download..."
  Pop $2
  
  nsDialogs::Show
FunctionEnd

Function PythonDownloadLeave
  ; Start the download
  StrCpy $PythonDownloadSuccess "0"
  
  DetailPrint "Downloading Python AI bundle..."
  
  ; Create temp directory for download
  SetOutPath "$TEMP\InvigilEye"
  
  ; Download with progress
  inetc::get /CAPTION "Downloading AI Bundle" /CANCELTEXT "Cancel" /POPUP "" \
    "${PYTHON_DOWNLOAD_URL}" "$TEMP\InvigilEye\python-portable.tar.gz" /END
  Pop $0
  
  ${If} $0 == "OK"
    DetailPrint "Download completed successfully"
    
    ; Extract the bundle to AppData
    DetailPrint "Extracting AI bundle..."
    
    ; Create python-portable directory in AppData
    CreateDirectory "$APPDATA\InvigilEye\python-portable"
    
    ; Use 7zip (bundled with NSIS) to extract
    nsExec::ExecToLog '"$INSTDIR\resources\7za.exe" x "$TEMP\InvigilEye\python-portable.tar.gz" -o"$TEMP\InvigilEye" -y'
    nsExec::ExecToLog '"$INSTDIR\resources\7za.exe" x "$TEMP\InvigilEye\python-portable.tar" -o"$APPDATA\InvigilEye\python-portable" -y'
    
    DetailPrint "AI bundle installed successfully"
    StrCpy $PythonDownloadSuccess "1"
    
    ; Clean up
    Delete "$TEMP\InvigilEye\python-portable.tar.gz"
    Delete "$TEMP\InvigilEye\python-portable.tar"
    RMDir "$TEMP\InvigilEye"
  ${Else}
    DetailPrint "Download failed: $0"
    MessageBox MB_ICONEXCLAMATION|MB_RETRYCANCEL \
      "Failed to download AI bundle. InvigilEye will download it on first launch instead.$\r$\n$\r$\nError: $0" \
      IDRETRY PythonDownloadLeave
    ; Continue installation even if download fails
  ${EndIf}
FunctionEnd

; Custom uninstall section to remove Python bundle
Section "un.RemovePythonBundle"
  DetailPrint "Removing AI bundle..."
  RMDir /r "$APPDATA\InvigilEye\python-portable"
SectionEnd

