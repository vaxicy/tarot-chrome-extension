/**
 * 打包脚本 - 创建用于 Chrome Web Store 上传的 ZIP 文件
 * 排除开发文件、测试文件和不需要的文件
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver').default || require('archiver');

// 需要排除的文件和目录
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  '.vscode',
  '.idea',
  '*.diff',
  '*.py',
  '*.md',
  'test_*',
  'add_keywords.js',
  'analyze_keywords.js',
  'build_osho.js',
  'gen_*.js',
  'package-extension.js',
  'package.json',
  'screenshots',
  '.gitignore',
  'LICENSE_SETUP.md'
];

// 需要包含的文件（白名单）
const INCLUDE_EXTENSIONS = [
  '.js', '.html', '.css', '.json', '.png', '.svg', '.md'
];

function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      // 简单通配符匹配
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(fileName)) {
        return true;
      }
    } else if (fileName === pattern || filePath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

function createPackage() {
  const output = fs.createWriteStream(path.join(__dirname, 'magic-tarot-v1.1.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function() {
    console.log(`✅ 打包完成！`);
    console.log(`📦 文件大小: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📁 输出文件: magic-tarot-v1.1.zip`);
    console.log(`\n🚀 下一步：`);
    console.log(`1. 访问 https://chrome.google.com/webstore/devconsole/`);
    console.log(`2. 登录开发者账号`);
    console.log(`3. 点击"上传新版本"或"新建项目"`);
    console.log(`4. 上传 magic-tarot-v1.1.zip`);
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // 添加文件
  function addFiles(dir, baseDir = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(baseDir, file);
      
      if (shouldExclude(relativePath) || shouldExclude(fullPath)) {
        console.log(`⏭️  跳过: ${relativePath}`);
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 递归添加目录
        archive.directory(fullPath, path.join(baseDir, file));
        console.log(`📁 添加目录: ${relativePath}`);
      } else {
        // 添加文件
        const ext = path.extname(file);
        if (INCLUDE_EXTENSIONS.includes(ext) || file === 'manifest.json') {
          archive.file(fullPath, { name: relativePath });
          console.log(`📄 添加文件: ${relativePath}`);
        }
      }
    }
  }

  addFiles(__dirname);
  
  archive.finalize();
}

console.log('🚀 开始打包 Chrome 扩展...\n');
createPackage();
