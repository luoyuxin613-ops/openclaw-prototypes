# Tavily Search 配置说明

## 快速开始

### 1. 获取 API Key
访问 https://tavily.com 注册并获取你的 API key

### 2. 配置环境变量
API key 已保存在 `~/.openclaw/workspace/.env` 文件中：

```bash
TAVILY_API_KEY=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
```

### 3. 测试配置
```bash
cd ~/.openclaw/workspace
export $(cat .env | grep -v '^#' | xargs)
node skills/tavily-search/scripts/test-tavily-config.mjs
```

## 使用方法

### 基础搜索
```bash
export $(cat .env | grep -v '^#' | xargs)
node skills/tavily-search/scripts/search.mjs "你的搜索查询"
```

### 高级选项
```bash
# 指定结果数量
node skills/tavily-search/scripts/search.mjs "query" -n 10

# 深度搜索（更详细，但更慢）
node skills/tavily-search/scripts/search.mjs "query" --deep

# 新闻搜索（最近 7 天）
node skills/tavily-search/scripts/search.mjs "query" --topic news --days 7
```

### 提取网页内容
```bash
node skills/tavily-search/scripts/extract.mjs "https://example.com/article"
```

## API 限制
- **免费版**: 100 次搜索/月
- **Key 前缀**: `tvly-dev-`
- **升级**: https://tavily.com/pricing

## 故障排查

### 问题：Missing TAVILY_API_KEY
**解决**: 确保 `.env` 文件存在且已正确加载

### 问题：HTTP 401/403
**解决**: API key 无效或已过期，重新获取

### 问题：HTTP 429
**解决**: 超出配额限制，等待下月或升级套餐

---
最后更新：2026-03-09
