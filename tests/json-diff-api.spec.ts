import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 读取 JsonDiffTool 组件内的比较函数逻辑进行导出测试
// 注意：这是一种测试模式，实际上应该将比较函数单独提取为可导出的工具函数
test.describe('JSON Diff API Tests', () => {
  // 模拟 JSON Diff 组件中的 compareObjects 函数
  const compareObjects = (
    left: any, 
    right: any, 
    currentPath: string[] = [], 
    result: any[] = []
  ): any[] => {
    // 处理两者类型不同的情况
    if (typeof left !== typeof right) {
      result.push({
        key: currentPath.join('.') || 'root',
        type: 'changed',
        leftValue: left,
        rightValue: right,
        path: [...currentPath]
      });
      return result;
    }

    // 处理基本类型
    if (typeof left !== 'object' || left === null || right === null) {
      if (left !== right) {
        result.push({
          key: currentPath.join('.') || 'root',
          type: 'changed',
          leftValue: left,
          rightValue: right,
          path: [...currentPath]
        });
      }
      return result;
    }

    // 处理数组
    if (Array.isArray(left) && Array.isArray(right)) {
      // 比较数组长度
      const maxLength = Math.max(left.length, right.length);
      for (let i = 0; i < maxLength; i++) {
        const newPath = [...currentPath, i.toString()];
        if (i >= left.length) {
          // 右侧数组有额外元素
          result.push({
            key: newPath.join('.'),
            type: 'added',
            rightValue: right[i],
            path: newPath
          });
        } else if (i >= right.length) {
          // 左侧数组有额外元素
          result.push({
            key: newPath.join('.'),
            type: 'removed',
            leftValue: left[i],
            path: newPath
          });
        } else {
          // 两边都有，递归比较
          compareObjects(left[i], right[i], newPath, result);
        }
      }
      return result;
    }

    // 处理对象
    // 收集所有的键
    const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);

    for (const key of allKeys) {
      const newPath = [...currentPath, key];
      
      if (!(key in left)) {
        // 右侧对象有额外属性
        result.push({
          key: newPath.join('.'),
          type: 'added',
          rightValue: right[key],
          path: newPath
        });
      } else if (!(key in right)) {
        // 左侧对象有额外属性
        result.push({
          key: newPath.join('.'),
          type: 'removed',
          leftValue: left[key],
          path: newPath
        });
      } else {
        // 两边都有，递归比较
        compareObjects(left[key], right[key], newPath, result);
      }
    }

    return result;
  };

  // 测试基本数据类型比较
  test('should compare primitive values correctly', () => {
    // 字符串比较
    let result = compareObjects('a', 'a');
    expect(result.length).toBe(0);
    
    result = compareObjects('a', 'b');
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    expect(result[0].leftValue).toBe('a');
    expect(result[0].rightValue).toBe('b');
    
    // 数字比较
    result = compareObjects(1, 1);
    expect(result.length).toBe(0);
    
    result = compareObjects(1, 2);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    
    // 布尔值比较
    result = compareObjects(true, false);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    
    // null 比较
    result = compareObjects(null, null);
    expect(result.length).toBe(0);
    
    result = compareObjects(null, 'value');
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
  });

  // 测试数组比较
  test('should compare arrays correctly', () => {
    // 完全相同的数组
    let result = compareObjects([1, 2, 3], [1, 2, 3]);
    expect(result.length).toBe(0);
    
    // 长度不同的数组 - 右侧多一个元素
    result = compareObjects([1, 2], [1, 2, 3]);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('added');
    expect(result[0].rightValue).toBe(3);
    expect(result[0].path).toEqual(['2']);
    
    // 长度不同的数组 - 左侧多一个元素
    result = compareObjects([1, 2, 3], [1, 2]);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('removed');
    expect(result[0].leftValue).toBe(3);
    expect(result[0].path).toEqual(['2']);
    
    // 元素值不同的数组
    result = compareObjects([1, 2, 3], [1, 4, 3]);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    expect(result[0].leftValue).toBe(2);
    expect(result[0].rightValue).toBe(4);
    expect(result[0].path).toEqual(['1']);
  });

  // 测试嵌套数组比较
  test('should compare nested arrays correctly', () => {
    const left = [1, [2, 3], 4];
    const right = [1, [2, 5], 4];
    
    const result = compareObjects(left, right);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    expect(result[0].leftValue).toBe(3);
    expect(result[0].rightValue).toBe(5);
    expect(result[0].path).toEqual(['1', '1']);
  });

  // 测试对象比较
  test('should compare objects correctly', () => {
    // 完全相同的对象
    let result = compareObjects({a: 1, b: 2}, {a: 1, b: 2});
    expect(result.length).toBe(0);
    
    // 键不同的对象 - 右侧多一个键
    result = compareObjects({a: 1, b: 2}, {a: 1, b: 2, c: 3});
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('added');
    expect(result[0].rightValue).toBe(3);
    expect(result[0].path).toEqual(['c']);
    
    // 键不同的对象 - 左侧多一个键
    result = compareObjects({a: 1, b: 2, c: 3}, {a: 1, b: 2});
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('removed');
    expect(result[0].leftValue).toBe(3);
    expect(result[0].path).toEqual(['c']);
    
    // 值不同的对象
    result = compareObjects({a: 1, b: 2}, {a: 1, b: 3});
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    expect(result[0].leftValue).toBe(2);
    expect(result[0].rightValue).toBe(3);
    expect(result[0].path).toEqual(['b']);
  });

  // 测试嵌套对象比较
  test('should compare nested objects correctly', () => {
    const left = {a: 1, b: {c: 2, d: 3}, e: 4};
    const right = {a: 1, b: {c: 2, d: 5}, e: 4};
    
    const result = compareObjects(left, right);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    expect(result[0].leftValue).toBe(3);
    expect(result[0].rightValue).toBe(5);
    expect(result[0].path).toEqual(['b', 'd']);
  });

  // 测试对象键顺序不同的情况
  test('should handle objects with different key order', () => {
    const left = {a: 1, b: 2, c: 3};
    const right = {c: 3, a: 1, b: 2};
    
    const result = compareObjects(left, right);
    expect(result.length).toBe(0); // 应该没有差异
  });

  // 测试复杂的嵌套结构
  test('should compare complex nested structures', () => {
    const left = {
      name: "项目A",
      version: "1.0.0",
      settings: {
        theme: "light",
        notifications: true
      },
      users: [
        {id: 1, name: "张三", roles: ["admin"]},
        {id: 2, name: "李四", roles: ["user"]}
      ]
    };
    
    const right = {
      name: "项目A",
      version: "1.1.0", // 版本不同
      settings: {
        notifications: true,
        theme: "dark" // 主题不同
      },
      users: [
        {id: 1, name: "张三", roles: ["admin"]},
        {id: 2, name: "李四", roles: ["user", "editor"]} // 多了一个角色
      ]
    };
    
    const result = compareObjects(left, right);
    expect(result.length).toBe(3);
    
    // 验证版本差异
    const versionDiff = result.find(d => d.path.join('.') === 'version');
    expect(versionDiff).toBeDefined();
    expect(versionDiff?.type).toBe('changed');
    expect(versionDiff?.leftValue).toBe('1.0.0');
    expect(versionDiff?.rightValue).toBe('1.1.0');
    
    // 验证主题差异
    const themeDiff = result.find(d => d.path.join('.') === 'settings.theme');
    expect(themeDiff).toBeDefined();
    expect(themeDiff?.type).toBe('changed');
    expect(themeDiff?.leftValue).toBe('light');
    expect(themeDiff?.rightValue).toBe('dark');
    
    // 验证角色差异
    const rolesDiff = result.find(d => d.path.join('.') === 'users.1.roles.1');
    expect(rolesDiff).toBeDefined();
    expect(rolesDiff?.type).toBe('added');
    expect(rolesDiff?.rightValue).toBe('editor');
  });

  // 测试极端情况
  test('should handle edge cases correctly', () => {
    // 空对象比较
    let result = compareObjects({}, {});
    expect(result.length).toBe(0);
    
    // 空数组比较
    result = compareObjects([], []);
    expect(result.length).toBe(0);
    
    // 不同类型比较
    result = compareObjects([], {});
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
    
    // undefined 比较
    result = compareObjects(undefined, undefined);
    expect(result.length).toBe(0);
    
    result = compareObjects(undefined, null);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('changed');
  });
});
