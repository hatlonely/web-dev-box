@echo off
echo 正在测试 JSON Diff 工具组件...

REM 首先确保项目构建是最新的
call npm run build

REM 安装 Playwright 浏览器（如果尚未安装）
call npx playwright install --with-deps

REM 运行 JSON Diff 工具的测试
call npm run test:json-diff

REM 打开测试报告
call npx playwright show-report
