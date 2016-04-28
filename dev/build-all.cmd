del ..\dist\SPAjs\*.* /Q /F
copy *.js ..\dist\SPAjs\.
call "build-spa.cmd"
call "build-spa-debug.cmd"
