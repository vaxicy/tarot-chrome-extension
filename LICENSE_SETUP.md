# 授权码验证功能 - 配置说明

## 已完成的工作

### 1. 授权服务器代码
- 文件：`license-worker.js`
- 这是一个 Cloudflare Workers 脚本，用于验证授权码
- 免费部署，每天 100,000 次请求额度

### 2. 扩展端代码
- `popup.js`：添加了授权验证逻辑
- `popup.html`：添加了授权管理弹窗
- `popup.css`：添加了授权界面样式
- `constants.js`：添加了国际化文本
- `manifest.json`：添加了 `host_permissions`

## 需要你做的事情

### 步骤 1：部署授权服务器

#### 方案 A：使用 Cloudflare Workers（推荐）

1. 注册 Cloudflare 账号（免费）
2. 进入 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 点击左侧 "Workers & Pages"
4. 点击 "Create Application" → "Create Worker"
5. 给 Worker 起个名字（如 `tarot-license`）
6. 将 `license-worker.js` 的代码复制粘贴到编辑器
7. 点击 "Save and Deploy"
8. 记录下你的 Worker URL，格式如：`https://tarot-license.your-subdomain.workers.dev`

#### 方案 B：使用 Vercel（简单）

1. 注册 Vercel 账号（免费）
2. 创建 `api/verify.js` 文件（需要改写成 Vercel Serverless Function 格式）
3. 部署到 Vercel

#### 方案 C：使用你自己的服务器

如果有自己的服务器，可以将 `license-worker.js` 改写成 Node.js/Express 格式部署。

### 步骤 2：修改扩展中的服务器地址

部署完成后，需要修改扩展代码中的服务器地址：

#### 需要修改的地方：

1. **popup.js** - 搜索 `https://your-license-server.com` 并替换：
   - 第 7105 行（verifyLicense 方法）
   - 第 7131 行（checkLicenseRemote 方法）
   - 第 7220 行（unbindLicense 方法）

2. **popup.html** - 修改购买链接：
   - 第 1036 行：`https://your-payment-page.com`

3. **manifest.json** - 修改 `host_permissions`：
   - 将 `https://your-license-server.com/*` 改为你的实际域名

示例：
```javascript
// 修改前
const serverUrl = 'https://your-license-server.com';

// 修改后
const serverUrl = 'https://tarot-license.your-subdomain.workers.dev';
```

### 步骤 3：生成授权码

#### 方法 A：通过 API 生成（推荐）

部署完成后，可以通过 API 生成授权码：

```bash
# 生成永久授权码
curl -X POST https://your-worker.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "YOUR_ADMIN_KEY_HERE",
    "code": "TAROT-ABCD-1234",
    "type": "lifetime",
    "maxDevices": 3,
    "note": "永久授权"
  }'

# 生成年付授权码
curl -X POST https://your-worker.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "YOUR_ADMIN_KEY_HERE",
    "code": "TAROT-EFGH-5678",
    "type": "yearly",
    "maxDevices": 1,
    "note": "年付授权"
  }'
```

#### 方法 B：直接修改代码

在 `license-worker.js` 中，直接修改 `LICENSES` 对象：

```javascript
const LICENSES = {
  'TAROT-ABCD-1234': {
    type: 'lifetime',
    maxDevices: 3,
    usedDevices: [],
    note: '永久授权',
    createdAt: '2026-01-01'
  },
  'TAROT-EFGH-5678': {
    type: 'yearly',
    maxDevices: 1,
    usedDevices: [],
    note: '年付授权',
    createdAt: '2026-01-01',
    expireDate: '2027-01-01'
  }
};
```

修改后重新部署 Worker。

### 步骤 4：设置购买链接

你需要一个地方让用户购买授权码。可以选择：

1. **爱发电**（推荐国内用户）
   - 网址：https://afdian.net/
   - 创建付费项目
   - 用户付款后，手动或通过 API 发送授权码

2. **微信支付商户**（需要企业资质）
   - 申请微信支付商户号
   - 开发支付回调接口
   - 自动发送授权码

3. **支付宝**（需要企业资质）
   - 申请支付宝商户
   - 开发支付回调接口

4. ** Gumroad**（推荐国际用户）
   - 网址：https://gumroad.com/
   - 支持信用卡、PayPal
   - 自动发送授权码

修改 `popup.html` 中的购买链接：
```html
<a href="https://afdian.net/a/your-project" id="license-purchase-link" ...>
```

### 步骤 5：测试

1. 在 Chrome 中加载扩展（开发者模式）
2. 点击工具栏的 🔓 授权按钮
3. 输入测试授权码
4. 点击 "验证授权码"
5. 检查是否成功解锁高级功能

## 功能说明

### 授权状态

- **未授权**：显示 "授权" 按钮
- **已授权**：显示 "PRO (永久)" 或 "PRO (年付)" 徽章

### 授权类型

1. **永久授权**（`type: 'lifetime'`）
   - 一次购买，永久使用
   - 适合一次性付费

2. **年付授权**（`type: 'yearly'`）
   - 按年付费
   - 到期需要续费
   - 适合订阅制

### 设备绑定

- 每个授权码最多绑定 `maxDevices` 台设备（默认 3 台）
- 用户可以在已授权的设备中 "解绑"
- 解绑后可以在新设备上使用

### 高级功能（需要授权）

在 `popup.js` 的 `checkFeatureAccess()` 方法中定义：

```javascript
const proFeatures = [
  'save_history',      // 保存历史记录
  'unlimited_spreads', // 无限制牌阵
  'detailed_reading',  // 详细解读
  'custom_spread',     // 自定义牌阵
  'all_decks'          // 所有牌组
];
```

你可以在代码中调用 `this.checkFeatureAccess('save_history')` 来检查用户是否有权限使用某个功能。

## 安全建议

1. **修改管理员密钥**
   - 在 `license-worker.js` 中，将 `YOUR_ADMIN_KEY_HERE` 改为一个强密码

2. **使用 Cloudflare KV 存储授权码**
   - 当前代码使用内存存储，每次部署会重置
   - 生产环境应该使用 Cloudflare KV 或 D1 数据库

3. **添加请求频率限制**
   - 防止暴力破解授权码
   - 可以在 Worker 中添加速率限制

4. **HTTPS 必须**
   - Cloudflare Workers 默认支持 HTTPS
   - 如果使用自己的服务器，必须配置 SSL 证书

## 故障排除

### 问题 1：授权验证失败，显示 "网络错误"

**原因**：
- 服务器地址配置错误
- 服务器未部署或部署失败
- 网络问题（国内访问 Cloudflare 可能不稳定）

**解决方法**：
1. 检查 `popup.js` 中的服务器地址是否正确
2. 在浏览器中访问你的 Worker URL，看是否返回 JSON
3. 如果 Cloudflare 访问不稳定，考虑使用国内服务器

### 问题 2：授权码验证成功，但刷新后失效

**原因**：
- 授权信息没有正确保存到 `chrome.storage.local`

**解决方法**：
1. 检查 `popup.js` 的 `activateLicense()` 方法
2. 在 Chrome 开发者工具中，查看 `chrome.storage.local` 是否有 `tarot_pro: true`

### 问题 3：设备绑定数量超过限制

**原因**：
- 用户清除了浏览器数据，导致 `deviceId` 变化
- 用户在不同浏览器中使用

**解决方法**：
1. 提供一个 "解绑" 功能（已实现）
2. 增加 `maxDevices` 数量
3. 使用更稳定的设备指纹（当前实现较简单）

## 下一步

1. 部署授权服务器
2. 修改扩展中的服务器地址
3. 生成测试授权码
4. 测试完整流程
5. 设置购买链接
6. 上架 Chrome Web Store

如有问题，可以随时问我！
