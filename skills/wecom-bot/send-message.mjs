#!/usr/bin/env node

/**
 * 企业微信机器人消息发送脚本
 * 用法：node send-message.mjs "消息内容"
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 手动解析 .env 文件
const envPath = join(__dirname, '../../.env');
const envContent = readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const BOT_ID = env.WECOM_BOT_ID;
const BOT_SECRET = env.WECOM_BOT_SECRET;

if (!BOT_ID || !BOT_SECRET) {
  console.error('❌ 缺少企业微信配置');
  console.error('请确保 .env 文件中包含:');
  console.error('  WECOM_BOT_ID=your_bot_id');
  console.error('  WECOM_BOT_SECRET=your_secret');
  process.exit(1);
}

const message = process.argv.slice(2).join(' ') || '测试消息';

// 企业微信机器人 API 端点
const WEBHOOK_URL = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${BOT_ID}`;

async function sendMessage() {
  try {
    const payload = {
      msgtype: 'text',
      text: {
        content: message,
        mentioned_list: ['@all']
      }
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.errcode === 0) {
      console.log('✅ 消息发送成功');
      console.log('消息内容:', message);
    } else {
      console.error('❌ 发送失败:', result);
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

sendMessage();
