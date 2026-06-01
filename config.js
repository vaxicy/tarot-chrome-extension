/**
 * 塔罗牌扩展 - 配置文件
 * 集中管理所有需要配置的变量
 */

const CONFIG = {
  // 授权服务器地址（部署后修改此处）
  // Cloudflare Workers 示例：'https://tarot-license.your-subdomain.workers.dev'
  // Vercel 示例：'https://your-project.vercel.app'
  // 自用服务器示例：'https://your-domain.com'
  LICENSE_SERVER: 'https://tarot-license.huangzero2004.workers.dev',

  // 购买链接（用户点击"获取授权码"时打开）
  // 爱发电商品链接
  PURCHASE_URL: 'https://ifdian.net/item/2e3cdab65d9011f1b4c65254001e7c00',

  // 管理员密钥（用于生成授权码，请修改为强密码）
  // 注意：此密钥会在前端代码中暴露，生产环境应使用后端 API
  ADMIN_KEY: 'Tarot@Admin#2026!X9mKpQwL',

  // 功能开关
  FEATURES: {
    enableProFeatures: true,    // 是否启用付费功能
    enableHistory: true,        // 是否允许保存历史记录（免费用户）
    enableAllDecks: false,      // 是否允许免费用户使用所有牌组
    maxFreeSpreads: 5,         // 免费用户每天可使用牌阵次数（0 = 无限制）
  },

  // 调试模式
  DEBUG: false
};

// 导出配置（如果在 popup.js 中通过 script 标签引入，则自动全局可用）
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
