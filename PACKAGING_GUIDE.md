# Chrome 扩展打包上传指南

## ✅ 已完成的清理工作

### 1. 移除测试代码
- ✅ 移除 `popup.js` 中的测试授权码 `TEST-ADMIN-2026`
- ✅ 移除 `popup.js` 中的管理员测试码跳过验证逻辑
- ✅ 移除 `popup.js` 中的"清除授权（测试）"按钮
- ✅ 移除 `license-worker-full.js` 中的测试授权码
- ✅ 删除测试文件 `test_healing_deck.js`
- ✅ 删除测试差异文件 `popup.diff`
- ✅ 删除 Python 脚本 `gen_osho.py`（用于生成数据，不需要打包）

### 2. 清理调试语句
- ✅ 移除 `popup.js` 中的所有 `console.log` 语句
- ✅ 移除 `popup.js` 中的所有 `console.warn` 语句
- ✅ 移除 `popup.js` 中的所有 `console.error` 语句

### 3. 修复隐私政策
- ✅ 更新 `PRIVACY_POLICY.md`（英文和中文）
- ✅ 如实说明扩展需要访问外部服务器进行授权验证
- ✅ 说明访问的域名：`tarot-license.huangzero2004.workers.dev` 和 `ifdian.net`

### 4. 检查配置文件
- ✅ `config.js` 中的 `DEBUG` 已设置为 `false`
- ✅ `manifest.json` 配置正确（Manifest V3）
- ✅ 图标文件齐全（16/48/128 px）

---

## 📦 手动打包步骤

由于 PowerShell 执行策略限制，请按以下步骤手动打包：

### 方法 1：使用 Windows 内置压缩功能

1. **打开项目目录**
   ```
   c:\Users\16704\Desktop\tarot
   ```

2. **选择要打包的文件和文件夹**
   
   保留以下文件和目录：
   - ✅ `icons/` (目录)
   - ✅ `popup.html`
   - ✅ `popup.css`
   - ✅ `popup.js`
   - ✅ `manifest.json`
   - ✅ `config.js`
   - ✅ `constants.js`
   - ✅ `tarot-cards.js`
   - ✅ `rider-waite-cards.js`
   - ✅ `marseille-cards.js`
   - ✅ `thoth-cards.js`
   - ✅ `angel-cards.js`
   - ✅ `healing-cards.js`
   - ✅ `osho-zen-cards.js`
   - ✅ `stellar-cards.js`
   - ✅ `deck-manager.js`
   - ✅ `dilemma-spread.js`
   - ✅ `PRIVACY_POLICY.md`
   - ✅ `README.md` (可选)

3. **排除以下文件和目录**
   - ❌ `node_modules/` (目录)
   - ❌ `.git/` (目录)
   - ❌ `.vscode/` (目录)
   - ❌ `*.diff` (所有 diff 文件)
   - ❌ `*.py` (所有 Python 脚本)
   - ❌ `test_*.js` (所有测试文件)
   - ❌ `add_keywords.js`
   - ❌ `analyze_keywords.js`
   - ❌ `build_osho.js`
   - ❌ `gen_*.js` (所有 gen_ 开头的文件)
   - ❌ `package-extension.js`
   - ❌ `package-extension.ps1`
   - ❌ `package.json`
   - ❌ `.gitignore`
   - ❌ `LICENSE_SETUP.md`
   - ❌ `*.log` (所有日志文件)

4. **压缩为 ZIP 文件**
   - 选中所有要打包的文件和目录
   - 右键 → "发送到" → "压缩(zipped)文件夹"
   - 命名为 `magic-tarot-v1.1.zip`

---

### 方法 2：使用命令行（需要管理员权限）

1. **打开 PowerShell（管理员）**
2. **运行以下命令**：
   ```powershell
   cd c:\Users\16704\Desktop\tarot
   Compress-Archive -Path icons, popup.html, popup.css, popup.js, manifest.json, config.js, constants.js, tarot-cards.js, rider-waite-cards.js, marseille-cards.js, thoth-cards.js, angel-cards.js, healing-cards.js, osho-zen-cards.js, stellar-cards.js, deck-manager.js, dilemma-spread.js, PRIVACY_POLICY.md, README.md -DestinationPath magic-tarot-v1.1.zip -CompressionLevel Optimal
   ```

---

## 🚀 上传到 Chrome Web Store

### 步骤 1：访问开发者控制台
1. 打开 https://chrome.google.com/webstore/devconsole/
2. 登录你的 Google 账号（应该已经完成）

### 步骤 2：创建新项目或上传新版本
- **如果是第一次上传**：
  1. 点击"新建项目"
  2. 上传 `magic-tarot-v1.1.zip`
  
- **如果是更新现有项目**：
  1. 点击现有项目
  2. 点击"上传新版本"
  3. 上传 `magic-tarot-v1.1.zip`

### 步骤 3：填写商店列表信息

#### 必填信息：
1. **名称**（中英文）：
   - 中文：`魔法塔罗牌`
   - 英文：`Magic Tarot`

2. **摘要**（最多 132 字符）：
   - 中文：`探索魔法世界的命运指引 - 支持多牌阵、多牌组的塔罗牌占卜扩展`
   - 英文：`Explore destiny guidance in the magical world - Tarot divination extension with multiple spreads and decks`

3. **详细描述**：
   ```
   🔮 魔法塔罗牌 - 每日占卜与指引
   
   用魔法塔罗牌解锁命运的奥秘！这款精美的 Chrome 扩展将古老塔罗智慧带入你的浏览器。
   
   ✨ 主要功能：
   • 5套精美塔罗牌组（伟特、托特、奥修禅卡等）
   • 16+种牌阵布局，适合各类问题
   • 中英双语支持
   • 保存占卜历史与收藏卡牌
   • 详细牌意解读
   
   🔒 PRO 版本：
   升级解锁全部牌组、无限牌阵和高级功能。一次性购买，终身使用！
   
   ⚠️ 免责声明：
   本扩展仅供娱乐和自我反思用途，不构成专业建议。
   
   适合每日指引、自我反思和灵性成长。
   ```

4. **截图**（至少 1 张，最多 5 张）：
   - 尺寸：1280×800 或 640×400（推荐 1280×800）
   - 内容：展示扩展的主要功能界面
   - 需要手动截图

5. **类别**：
   - 主要类别： Productivity（生产力工具）或 Fun（趣味）
   - 次要类别：Self-Improvement（自我提升）

6. **语言**：
   - 支持的语言：English, 中文（简体）

7. **地区**：
   - 所有地区

#### 可选信息：
8. **宣传图**：
   - 尺寸：440×280 像素
   - 用于 Chrome Web Store 的精选故事

9. **YouTube 视频**（如果有）：
   - 演示视频链接

10. **网站**（如果有）：
    - 项目 GitHub 链接：https://github.com/vaxicy/tarot-chrome-extension

### 步骤 4：隐私政策链接
- 上传 `PRIVACY_POLICY.md` 到 GitHub
- 在商店列表的"隐私政策"字段填写链接
- 或者直接在字段中粘贴隐私政策文本

### 步骤 5：提交审核
1. 检查所有信息是否填写完整
2. 点击"提交审核"
3. 等待 Google 审核（通常 1-3 天）

---

## ⚠️ 重要注意事项

### 1. 占卜类内容的合规性
Chrome Web Store 对占卜类扩展有一定限制：
- ✅ 必须明确标注"仅供娱乐"（for entertainment purposes only）
- ✅ 在描述中加入：`This extension is for entertainment and self-reflection purposes only.`

### 2. 授权码验证的合法性
你的扩展需要访问外部服务器进行授权验证：
- ✅ 已在隐私政策中说明
- ✅ 在 `manifest.json` 中声明了 `host_permissions`
- ✅ 确保服务器稳定可用

### 3. 支付链接的合规性
你在 `host_permissions` 里声明了 `https://ifdian.net/item/*`：
- ✅ 扩展内可以打开爱发电链接
- ✅ 需要确保支付流程清晰透明
- ✅ 在描述中说明"PRO 版本需在爱发电购买授权码"

---

## 📋 上传前的最终检查清单

- [ ] 测试按钮已移除
- [ ] 测试授权码已移除
- [ ] 调试语句（console.log 等）已清理
- [ ] 隐私政策已更新并如实说明
- [ ] 图标文件齐全（16/48/128 px）
- [ ] manifest.json 配置正确
- [ ] ZIP 文件已创建，不包含开发文件
- [ ] 截图已准备（至少 1 张）
- [ ] 商店列表信息已准备好
- [ ] 隐私政策链接已准备好

---

## 🎉 完成后

上传成功后：
1. 等待审核（1-3 天）
2. 审核通过后自动上架
3. 分享链接给你的用户！

---

**祝你上架成功！** 🚀

如有问题，请查看 Chrome Web Store 开发者文档：
https://developer.chrome.com/docs/webstore/
