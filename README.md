# 🔮 Harry Potter Tarot Chrome Extension / 哈利波特塔罗牌 Chrome 扩展

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## 🔮 Harry Potter Tarot Chrome Extension

A magical Chrome extension that brings tarot divination to your browser with a Harry Potter theme. Explore destiny's guidance through various tarot spreads and decks.

### ✨ Features

- **Multiple Tarot Decks**: Choose from 5 beautifully designed tarot decks
- **Various Spread Layouts**: 16+ different tarot spreads for different types of questions
- **Bilingual Support**: Full Chinese and English localization
- **Card Collection**: Save your favorite cards to your collection
- **Reading History**: Review your past tarot readings
- **Sound Effects**: Optional card flipping sound effects
- **Card Preview**: Hover to preview card details
- **Responsive Design**: Beautiful UI that adapts to the popup window

### 🎴 Supported Decks

| Deck | Description (EN) | Description (ZH) |
|------|------------------|------------------|
| Harry Potter | Harry Potter themed tarot cards | 哈利波特主题塔罗牌 |
| Rider-Waite | Classic Rider-Waite tarot deck | 伟特塔罗牌 |
| Marseille | Traditional Marseille tarot deck | 马赛塔罗牌 |
| Thoth | Aleister Crowley Thoth tarot deck | 托特塔罗牌 |
| Angel | Angel-themed tarot cards | 天使塔罗牌 |

### 📋 Supported Spreads

1. **Single Card** - Quick daily guidance
2. **Three Card Spread** - Past, Present, Future
3. **Celtic Cross** - Comprehensive life reading
4. **Relationship Spread** - Love and relationship insights
5. **Career Spread** - Career and work guidance
6. **Decision Spread** - Help with difficult choices
7. **Chakra Spread** - Energy center balance
8. **Moon Cycle Spread** - Lunar phase guidance
9. **Year Ahead Spread** - Annual forecast
10. **Question Spread** - Specific question reading
11. **Zodiac Spread** - Astrological influences
12. **Element Spread** - Elemental energies
13. **Yes/No Spread** - Simple binary answers
14. **Shadow Work Spread** - Self-reflection and growth
15. **Gratitude Spread** - Appreciation and abundance
16. **Dilemma Spread** - Complex situation analysis

### 📦 Installation

#### From Chrome Web Store (Coming Soon)
> The extension will be published to Chrome Web Store in the future.

#### Manual Installation (Developer Mode)
1. Download or clone this repository
   ```bash
   git clone https://github.com/vaxicy/tarot-chrome-extension.git
   ```
2. Open Chrome browser and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the downloaded folder
5. The extension icon should appear in your Chrome toolbar

### 🚀 Usage

1. Click the extension icon in Chrome toolbar
2. Select your preferred tarot deck
3. Choose your language (Chinese/English)
4. Select a spread layout
5. Click "Draw Cards" to start your reading
6. Click on cards to reveal their meanings
7. Save favorite cards to your collection

### 🛠️ Technical Details

- **Manifest Version**: 3
- **Permissions**: `storage` (for saving history and favorites)
- **Architecture**: Vanilla JavaScript, HTML5, CSS3
- **No External Dependencies**: Pure frontend implementation

### 📁 Project Structure

```
tarot-chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup UI
├── popup.css              # Styles
├── popup.js               # Main logic
├── tarot-cards.js         # Base card definitions
├── deck-manager.js        # Deck management
├── rider-waite-cards.js  # Rider-Waite deck
├── marseille-cards.js     # Marseille deck
├── thoth-cards.js         # Thoth deck
├── angel-cards.js         # Angel deck
├── base-cards.js          # Harry Potter deck
├── dilemma-spread.js      # Dilemma spread logic
├── icons/                 # Extension icons
└── generate-icons.js      # Icon generation script
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 🙏 Acknowledgments

- Tarot card meanings based on traditional Rider-Waite symbolism
- Harry Potter theme for entertainment purposes
- Icons and design inspired by various tarot traditions

---

<a name="中文"></a>
## 🔮 哈利波特塔罗牌 Chrome 扩展

一款充满魔法的 Chrome 浏览器扩展，将塔罗占卜带入你的浏览器。通过多种牌阵和牌组探索命运指引。

### ✨ 功能特点

- **多种塔罗牌组**: 5 套精美设计的塔罗牌可供选择
- **丰富牌阵布局**: 16+ 种不同牌阵，适合各类问题
- **双语支持**: 完整的中英文本地化
- **卡牌收藏**: 保存喜爱的卡牌到收藏夹
- **占卜历史**: 回顾过去的塔罗占卜记录
- **音效开关**: 可选的翻牌音效
- **卡牌预览**: 悬停预览卡牌详细信息
- **精美设计**: 适配弹出窗口的精美 UI

### 🎴 支持的牌组

| 牌组 | 说明 |
|------|------|
| 哈利波特主题 | 哈利波特主题塔罗牌 |
| 伟特塔罗 | 经典伟特塔罗牌 |
| 马赛塔罗 | 传统马赛塔罗牌 |
| 托特塔罗 | 克劳利托特塔罗牌 |
| 天使塔罗 | 天使主题塔罗牌 |

### 📋 支持的牌阵

1. **单张牌阵** - 每日快速指引
2. **三张牌阵** - 过去、现在、未来
3. **凯尔特十字** - 全面人生解读
4. **感情牌阵** - 爱情与关系洞察
5. **事业牌阵** - 职业与工作指引
6. **决策牌阵** - 帮助困难选择
7. **脉轮牌阵** - 能量中心平衡
8. **月相牌阵** - 月相指引
9. **全年牌阵** - 年度预测
10. **问题牌阵** - 特定问题解读
11. **星座牌阵** - 占星影响
12. **元素牌阵** - 元素能量
13. **是否牌阵** - 简单二元答案
14. **阴影工作牌阵** - 自我反思与成长
15. **感恩牌阵** - 感恩与丰盛
16. **困境牌阵** - 复杂情况分析

### 📦 安装方法

#### 从 Chrome 网上应用店安装（即将推出）
> 该扩展将在未来发布到 Chrome 网上应用店。

#### 手动安装（开发者模式）
1. 下载或克隆此仓库
   ```bash
   git clone https://github.com/vaxicy/tarot-chrome-extension.git
   ```
2. 打开 Chrome 浏览器，导航到 `chrome://extensions/`
3. 在右上角启用"开发者模式"
4. 点击"加载已解压的扩展程序"，选择下载的文件夹
5. 扩展图标将出现在 Chrome 工具栏中

### 🚀 使用方法

1. 点击 Chrome 工具栏中的扩展图标
2. 选择你喜欢的塔罗牌组
3. 选择语言（中文/英文）
4. 选择一个牌阵布局
5. 点击"抽牌"开始占卜
6. 点击卡牌揭示其含义
7. 将喜爱的卡牌保存到收藏夹

### 🛠️ 技术细节

- **Manifest 版本**: 3
- **权限**: `storage`（用于保存历史和收藏）
- **架构**: 原生 JavaScript、HTML5、CSS3
- **无外部依赖**: 纯前端实现

### 📁 项目结构

```
tarot-chrome-extension/
├── manifest.json          # 扩展配置
├── popup.html             # 主弹出窗口 UI
├── popup.css              # 样式表
├── popup.js               # 主要逻辑
├── tarot-cards.js         # 基础卡牌定义
├── deck-manager.js        # 牌组管理
├── rider-waite-cards.js   # 伟特牌组
├── marseille-cards.js     # 马赛牌组
├── thoth-cards.js         # 托特牌组
├── angel-cards.js         # 天使牌组
├── base-cards.js          # 哈利波特牌组
├── dilemma-spread.js      # 困境牌阵逻辑
├── icons/                 # 扩展图标
└── generate-icons.js      # 图标生成脚本
```

### 🤝 贡献指南

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/新功能`)
3. 提交你的更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 打开 Pull Request

### 📝 许可证

本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

### 🙏 致谢

- 塔罗牌含义基于传统伟特象征意义
- 哈利波特主题仅供娱乐目的
- 图标和设计灵感来自各种塔罗传统

---

### 📧 Contact / 联系方式

- **GitHub Issues**: [Report a bug or suggest a feature](https://github.com/vaxicy/tarot-chrome-extension/issues)
- **Email**: 13036884004@163.com

---

<div align="center">
  <p>Made with ✨ magic and 🔮 divination</p>
  <p>用 ✨ 魔法和 🔮 占卜制作</p>
</div>
