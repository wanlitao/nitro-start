# windows 注册表写入app的唤起协议

!macro customInstall
  DetailPrint "Register nitro-electron URI Handler"
  DeleteRegKey HKCR "nitro-electron"
  WriteRegStr HKCR "nitro-electron" "" "URL:nitro-electron"
  WriteRegStr HKCR "nitro-electron" "URL Protocol" ""
  WriteRegStr HKCR "nitro-electron\shell" "" ""
  WriteRegStr HKCR "nitro-electron\shell\Open" "" ""
  WriteRegStr HKCR "nitro-electron\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend

!macro customUnInstall
  DeleteRegKey HKCR "nitro-electron"
!macroend
