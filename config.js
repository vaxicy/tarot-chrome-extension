/**
 * 塔罗牌扩展 - 配置文件
 * 集中管理所有需要配置的变量
 */

const CONFIG = {
  // 功能开关
  FEATURES: {
    enableHistory: true,        // 是否允许保存历史记录
    enableAllDecks: true,       // 是否允许使用所有牌组
  },

  // 调试模式
  DEBUG: false,

  // 捐赠链接（PayPal.Me）
  PAYPAL_ME_URL: 'https://www.paypal.com/ncp/payment/29RYNBGDQV4N2'
};

// 导出配置（如果在 popup.js 中通过 script 标签引入，则自动全局可用）
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
