#!/usr/bin/env node

// Tavily API 配置测试脚本
// 使用方法：node test-tavily-config.mjs

const apiKey = process.env.TAVILY_API_KEY ?? "";

console.log("🔍 Tavily API 配置检查\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (!apiKey) {
  console.error("❌ 错误：TAVILY_API_KEY 环境变量未设置");
  console.error("\n请在 .env 文件中添加:");
  console.error("TAVILY_API_KEY=your_api_key_here");
  process.exit(1);
}

console.log("✅ API Key 已配置");
console.log(`   Key 前缀：${apiKey.slice(0, 15)}...`);
console.log(`   Key 长度：${apiKey.length} 字符`);
console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// 执行测试搜索
const query = "What is the capital of France?";
console.log(`📝 测试搜索："${query}"\n`);

const body = {
  api_key: apiKey,
  query: query,
  search_depth: "basic",
  max_results: 1,
};

try {
  const resp = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  const results = data.results ?? [];

  if (results.length > 0) {
    const r = results[0];
    console.log("✅ 搜索成功！\n");
    console.log(`📌 结果标题：${r.title}`);
    console.log(`🔗 来源 URL: ${r.url}`);
    console.log(`📄 内容摘要：${r.content?.slice(0, 150)}...`);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Tavily 搜索功能已就绪，可以正常使用！\n");
  } else {
    console.log("⚠️ 未找到搜索结果，但 API 调用成功");
  }
} catch (err) {
  console.error("❌ 测试失败:", err.message);
  process.exit(1);
}
