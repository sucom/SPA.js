del dist\*.* /Q /F
copy *.js dist\.
call "build-klib.cmd"
call "build-klib-debug.cmd"
call "build-validate.cmd"
call "build-validate-debug.cmd"
call "build-bundle+debug.cmd"
call "build-bundle-debug.cmd"