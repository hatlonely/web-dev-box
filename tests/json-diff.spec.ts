import { test, expect } from '@playwright/test';

// 测试 JSON Diff 工具
test.describe('JSON Diff Tool Tests', () => {
  // 在每个测试前访问 JSON Diff 工具页面
  test.beforeEach(async ({ page }) => {
    // 访问 JSON Diff 工具页面
    await page.goto('http://localhost:3000/tool/json-diff');
    
    // 等待页面加载完成
    await page.waitForSelector('h2:has-text("JSON Diff 对比工具")');
  });

  // 测试页面是否正确加载
  test('should load the JSON Diff tool correctly', async ({ page }) => {
    // 验证页面标题
    const title = await page.textContent('h2');
    expect(title).toBe('JSON Diff 对比工具');
    
    // 验证输入区域是否存在
    const leftTextArea = await page.locator('textarea').nth(0);
    const rightTextArea = await page.locator('textarea').nth(1);
    
    expect(await leftTextArea.isVisible()).toBeTruthy();
    expect(await rightTextArea.isVisible()).toBeTruthy();
    
    // 验证按钮是否存在
    expect(await page.locator('button:has-text("比较")').isVisible()).toBeTruthy();
    expect(await page.locator('button:has-text("示例数据")').isVisible()).toBeTruthy();
    expect(await page.locator('button:has-text("清空")').isVisible()).toBeTruthy();
    expect(await page.locator('button:has-text("复制差异")').isVisible()).toBeTruthy();
  });

  // 测试示例数据功能
  test('should load sample data correctly', async ({ page }) => {
    // 点击示例数据按钮
    await page.click('button:has-text("示例数据")');
    
    // 验证左侧和右侧文本区域是否填充了示例数据
    const leftTextArea = await page.locator('textarea').nth(0);
    const rightTextArea = await page.locator('textarea').nth(1);
    
    const leftValue = await leftTextArea.inputValue();
    const rightValue = await rightTextArea.inputValue();
    
    // 验证示例数据是有效的 JSON
    expect(() => JSON.parse(leftValue)).not.toThrow();
    expect(() => JSON.parse(rightValue)).not.toThrow();
    
    // 验证示例数据包含预期的字段
    const leftJson = JSON.parse(leftValue);
    const rightJson = JSON.parse(rightValue);
    
    expect(leftJson).toHaveProperty('name');
    expect(leftJson).toHaveProperty('version');
    expect(leftJson).toHaveProperty('tools');
    expect(leftJson).toHaveProperty('settings');
    
    expect(rightJson).toHaveProperty('name');
    expect(rightJson).toHaveProperty('version');
    expect(rightJson).toHaveProperty('tools');
    expect(rightJson).toHaveProperty('settings');
  });

  // 测试比较功能
  test('should correctly identify differences between two JSON objects', async ({ page }) => {
    // 准备测试数据
    const leftJson = {
      "name": "测试对象",
      "value": 123,
      "status": true,
      "items": [1, 2, 3]
    };
    
    const rightJson = {
      "name": "测试对象",
      "value": 456,
      "items": [1, 2, 3, 4],
      "newField": "新增字段"
    };
    
    // 填充测试数据
    await page.locator('textarea').nth(0).fill(JSON.stringify(leftJson, null, 2));
    await page.locator('textarea').nth(1).fill(JSON.stringify(rightJson, null, 2));
    
    // 点击比较按钮
    await page.click('button:has-text("比较")');
    
    // 等待比较结果显示
    await page.waitForSelector('h4:has-text("比较结果")');
    
    // 验证差异结果
    const diffResults = await page.locator('div[style*="backgroundColor"]').allTextContents();
    
    // 应该有4个差异: value变化, status删除, items新增元素, newField新增
    expect(diffResults.length).toBeGreaterThanOrEqual(4);
    
    // 验证是否包含预期的差异信息
    const diffText = await page.textContent('div.ant-card-body');
    expect(diffText).toContain('value');
    expect(diffText).toContain('123');
    expect(diffText).toContain('456');
    expect(diffText).toContain('status');
    expect(diffText).toContain('items.3');
    expect(diffText).toContain('newField');
  });

  // 测试错误处理 - 无效的JSON
  test('should show error for invalid JSON input', async ({ page }) => {
    // 在左侧输入无效的 JSON
    await page.locator('textarea').nth(0).fill('{ "name": "无效JSON, 缺少引号 }');
    await page.locator('textarea').nth(1).fill('{ "name": "有效JSON" }');
    
    // 点击比较按钮
    await page.click('button:has-text("比较")');
    
    // 验证是否显示错误消息
    const errorMessage = await page.textContent('div[style*="color: #ff4d4f"]');
    expect(errorMessage).toContain('JSON解析错误');
  });

  // 测试清空功能
  test('should clear all inputs and results', async ({ page }) => {
    // 先加载示例数据
    await page.click('button:has-text("示例数据")');
    
    // 点击比较按钮
    await page.click('button:has-text("比较")');
    
    // 等待比较结果显示
    await page.waitForSelector('div.ant-card-body');
    
    // 点击清空按钮
    await page.click('button:has-text("清空")');
    
    // 验证输入框是否被清空
    const leftTextArea = await page.locator('textarea').nth(0);
    const rightTextArea = await page.locator('textarea').nth(1);
    
    expect(await leftTextArea.inputValue()).toBe('');
    expect(await rightTextArea.inputValue()).toBe('');
    
    // 验证结果区域是否恢复到初始状态
    const resultText = await page.textContent('h4:has-text("比较结果") + div');
    expect(resultText).toContain('进行比较后，结果将显示在这里');
  });

  // 测试复制差异功能 (这需要模拟剪贴板)
  test('should enable copy button when differences are found', async ({ page }) => {
    // 加载示例数据
    await page.click('button:has-text("示例数据")');
    
    // 初始状态下复制按钮应该是禁用的
    const copyButton = page.locator('button:has-text("复制差异")');
    expect(await copyButton.isDisabled()).toBeTruthy();
    
    // 执行比较
    await page.click('button:has-text("比较")');
    
    // 等待比较结果
    await page.waitForSelector('div.ant-card-body');
    
    // 比较后复制按钮应该可用
    expect(await copyButton.isDisabled()).toBeFalsy();
  });

  // 测试相同JSON的比较结果
  test('should indicate when JSONs are identical', async ({ page }) => {
    // 准备相同的JSON
    const sameJson = {
      "name": "相同的JSON",
      "value": 123
    };
    
    // 填充测试数据
    await page.locator('textarea').nth(0).fill(JSON.stringify(sameJson, null, 2));
    await page.locator('textarea').nth(1).fill(JSON.stringify(sameJson, null, 2));
    
    // 点击比较按钮
    await page.click('button:has-text("比较")');
    
    // 等待提示消息
    await page.waitForSelector('.ant-message');
    
    // 验证是否显示"两个JSON完全相同"的消息
    const message = await page.textContent('.ant-message');
    expect(message).toContain('两个JSON完全相同');
  });
});
