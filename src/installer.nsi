;NSIS Modern User Interface
;Request application privileges for Windows Vista
  RequestExecutionLevel admin
;--------------------------------
;Include Modern UI

  !include "MUI2.nsh"
  !include LogicLib.nsh
  !include "x64.nsh"

;--------------------------------
;General
  ;Name and file
  Name "FacebookStreamer"
  OutFile "FacebookStreamer-Installer.exe"

  ;Default installation folder
  InstallDir "$APPDATA\FacebookStreamer"
  
  ;Get installation folder from registry if available
  InstallDirRegKey HKCU "Software\FacebookStreamer" "FacebookStreamer"

;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING
  !define MUI_FINISHPAGE_RUN "$INSTDIR\FacebookStreamer.exe"
;--------------------------------
;Pages
  Page Custom PasswordPageShow PasswordPageLeave
  !define MUI_PAGE_CUSTOMFUNCTION_SHOW ComponentsPageShow
  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH
  
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

  
;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "Spanish"

;--------------------------------
;Installer Sections

Section "TadeoArmenta Software" SectionInstall

  ${If} ${RunningX64}
    SetOutPath "$INSTDIR"
  
    ;ADD YOUR OWN FILES HERE...
    File /r "dist_electron\win-unpacked\FacebookStreamer.exe"
    
    ;Store installation folder
    WriteRegStr HKCU "Software\FacebookStreamer" "" $INSTDIR
    ;Register For windows startup
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "FacebookStreamer" "$INSTDIR\FacebookStreamer.exe"
    
    ;Create uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"
  ${Else}
    SetOutPath "$INSTDIR"
  
    ;ADD YOUR OWN FILES HERE...
    File /r "src\32\*.*"
    
    ;Store installation folder
    WriteRegStr HKCU "Software\FacebookStreamer" "" $INSTDIR
    ;Register For windows startup
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "FacebookStreamer" "$INSTDIR\FacebookStreamer.exe"   
    ;Create uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"
  ${EndIf}
SectionEnd

Function ComponentsPageShow

 ## Disable the Back button
 GetDlgItem $R0 $HWNDPARENT 3
 EnableWindow $R0 0

FunctionEnd
;--------------------------------
;Descriptions

  ;Language strings
  LangString DESC_SectionInstall 1034 "A test section."

  ;Assign language strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SectionInstall} $(DESC_SectionInstall)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END

;--------------------------------
;Uninstaller Section

Section "Uninstall"  
  Delete "$INSTDIR\*.*"

  RMDir "$INSTDIR"

  DeleteRegKey  HKCU "Software\Microsoft\Windows\FacebookStreamer"
  DeleteRegKey  HKCU "Software\Microsoft\Windows\CurrentVersion\Run\FacebookStreamer" 
  DeleteRegKey  HKCU "Software\FacebookStreamer"

SectionEnd
;--------------------------------