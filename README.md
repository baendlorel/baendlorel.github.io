# 🌟 KasukabeTsumugi NPM Packages Showcase

A beautiful, interactive website to showcase all NPM packages and repositories created by KasukabeTsumugi. This site automatically fetches repository information from GitHub API and displays them in an elegant, responsive interface.

[English](#english) | [中文](#中文)

---

## English

### ✨ Features

- 🚀 **Automatic Repository Detection**: Fetches all public repositories from GitHub API
- 📦 **NPM Package Integration**: Automatically detects which repositories are NPM packages
- 🔍 **Smart Search & Filtering**: Search by name, description, or tags with real-time filtering
- 📱 **Fully Responsive**: Beautiful design that works on all devices
- 🎨 **Modern Dark Theme**: Eye-friendly dark theme with beautiful gradients
- ⚡ **Fast & Lightweight**: Pure vanilla JavaScript, no heavy frameworks
- 🎯 **GitHub Pages Ready**: Automatic deployment via GitHub Actions

### 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/baendlorel/kasukabe-tsumugi-homepage.git
   cd kasukabe-tsumugi-homepage
   ```

2. **Configure your GitHub username**:
   Edit `script.js` and update the `GITHUB_USERNAME` constant:

   ```javascript
   const GITHUB_USERNAME = 'your-github-username';
   ```

3. **Deploy to GitHub Pages**:
   - Push to your repository
   - Go to Settings > Pages
   - Select "GitHub Actions" as source
   - The site will automatically deploy on push to main branch

### 🎯 Usage

The website automatically:

- Fetches all your public repositories
- Detects NPM packages by checking for `package.json`
- Displays repository statistics (stars, forks, language, etc.)
- Provides direct links to GitHub repos and NPM packages
- Allows filtering by package type (All, NPM Packages, Libraries, Tools)
- Enables real-time search functionality

### 🎨 Customization

#### Update Personal Information

Edit `index.html` to update:

- Your name and bio
- Contact email
- Social media links

#### Modify Styling

Edit `styles.css` to customize:

- Color scheme (CSS custom properties in `:root`)
- Layout and spacing
- Animations and effects

#### Add Features

The modular JavaScript architecture makes it easy to add new features:

- Additional API integrations
- More filtering options
- Enhanced statistics
- Custom animations

### 📁 Project Structure

```
kasukabe-tsumugi-homepage/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── README.md          # Documentation
```

### 🌐 API Reference

The application uses the following APIs:

#### GitHub API

- **Endpoint**: `https://api.github.com/users/{username}/repos`
- **Purpose**: Fetch repository information
- **Rate Limit**: 60 requests per hour (unauthenticated)

#### NPM Registry API

- **Endpoint**: `https://registry.npmjs.org/{package-name}`
- **Purpose**: Get NPM package information
- **Rate Limit**: No official limit

### 🎭 Easter Eggs

Try entering the Konami Code (↑↑↓↓←→←→BA) for a fun surprise! (ﾉ ◕ ヮ ◕)ﾉ\*:･ﾟ ✧

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📄 License

This project is open source and available under the [MIT License](LICENSE).

### 👤 Author

**KasukabeTsumugi**

- Email: futami16237@gmail.com
- GitHub: [@baendlorel](https://github.com/baendlorel)

---

## 中文

### ✨ 功能特点

- 🚀 **自动仓库检测**: 从 GitHub API 自动获取所有公开仓库
- 📦 **NPM 包集成**: 自动检测哪些仓库是 NPM 包
- 🔍 **智能搜索和过滤**: 按名称、描述或标签搜索，实时过滤
- 📱 **完全响应式**: 在所有设备上都能完美显示的美观设计
- 🎨 **现代暗色主题**: 护眼的暗色主题配以美丽的渐变效果
- ⚡ **快速轻量**: 纯原生 JavaScript，无重型框架
- 🎯 **GitHub Pages 就绪**: 通过 GitHub Actions 自动部署

### 🛠️ 安装方法

1. **克隆仓库**:

   ```bash
   git clone https://github.com/baendlorel/kasukabe-tsumugi-homepage.git
   cd kasukabe-tsumugi-homepage
   ```

2. **配置你的 GitHub 用户名**:
   编辑 `script.js` 并更新 `GITHUB_USERNAME` 常量:

   ```javascript
   const GITHUB_USERNAME = 'your-github-username';
   ```

3. **部署到 GitHub Pages**:
   - 推送到你的仓库
   - 前往 Settings > Pages
   - 选择 "GitHub Actions" 作为源
   - 网站将在推送到主分支时自动部署

### 🎯 使用方法

网站会自动：

- 获取你的所有公开仓库
- 通过检查 `package.json` 文件检测 NPM 包
- 显示仓库统计信息（星标、分叉、语言等）
- 提供到 GitHub 仓库和 NPM 包的直接链接
- 允许按包类型过滤（全部、NPM 包、库、工具）
- 启用实时搜索功能

### 🎨 自定义

#### 更新个人信息

编辑 `index.html` 来更新：

- 你的姓名和简介
- 联系邮箱
- 社交媒体链接

#### 修改样式

编辑 `styles.css` 来自定义：

- 配色方案（`:root` 中的 CSS 自定义属性）
- 布局和间距
- 动画和效果

#### 添加功能

模块化的 JavaScript 架构使添加新功能变得简单：

- 额外的 API 集成
- 更多过滤选项
- 增强的统计信息
- 自定义动画

### 📁 项目结构

```
kasukabe-tsumugi-homepage/
├── index.html          # 主 HTML 结构
├── styles.css          # 样式和响应式设计
├── script.js           # JavaScript 功能
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 部署
└── README.md          # 文档
```

### 🌐 API 参考

应用程序使用以下 API：

#### GitHub API

- **端点**: `https://api.github.com/users/{username}/repos`
- **用途**: 获取仓库信息
- **速率限制**: 每小时 60 次请求（未认证）

#### NPM 注册表 API

- **端点**: `https://registry.npmjs.org/{package-name}`
- **用途**: 获取 NPM 包信息
- **速率限制**: 无官方限制

### 🎭 彩蛋

试试输入科乐美代码（↑↑↓↓←→←→BA）会有惊喜哦！(ﾉ ◕ ヮ ◕)ﾉ\*:･ﾟ ✧

### 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

### 📄 许可证

本项目是开源的，采用 [MIT 许可证](LICENSE)。

### 👤 作者

**KasukabeTsumugi**

- 邮箱: futami16237@gmail.com
- GitHub: [@baendlorel](https://github.com/baendlorel)

---

Made with ❤️ and lots of ☕ by KasukabeTsumugi (◕‿◕)
