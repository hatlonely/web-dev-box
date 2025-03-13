#!/bin/bash

# 首先确保项目构建是最新的
npm run build

# 安装 Playwright 浏览器（如果尚未安装）
npx playwright install --with-deps

# 运行 JSON Diff 工具的测试
npm run test:json-diff

# 打开测试报告
npx playwright show-report
