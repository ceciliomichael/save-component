@echo off
echo Installing dependencies...
npm install

echo Building project...
npm run build

echo Done! Please restart Cursor to use the MCP server.
pause 