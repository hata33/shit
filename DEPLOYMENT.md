# 🚀 Vercel 部署指南

本项目已配置支持 Vercel 自动部署。

## 方法一：通过 Vercel CLI 部署

### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署项目

```bash
vercel
```

按照提示操作：
- 链接到现有项目或创建新项目
- 确认构建设置（Vercel 会自动检测 Next.js）
- 等待部署完成

### 4. 设置自动部署（首次部署后）

```bash
vercel --prod
```

这将：
- 关联 Git 仓库
- 设置自动部署（push 到 main 分支时自动部署）
- 配置生产环境域名

---

## 方法二：通过 Vercel 网站部署

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 在 Vercel 导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 登录并点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测到 Next.js 项目并配置

### 3. 配置项目设置

在 Vercel 项目设置中确认：

| 设置项 | 值 |
|--------|-----|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Install Command | `npm install` |

### 4. 自动部署完成！

现在每次推送到 `main` 分支，Vercel 会自动：
1. 拉取最新代码
2. 运行 `npm install`
3. 运行 `npm run build`
4. 部署到生产环境

---

## 🌍 环境变量（可选）

如果需要配置环境变量，在 Vercel 项目设置中添加：

| 变量名 | 说明 |
|--------|------|
| NODE_ENV | 自动设置为 `production` |

---

## 📊 部署状态

部署完成后，你会获得：

- **生产 URL**: `https://你的项目名.vercel.app`
- **自动 HTTPS**: 证书自动配置
- **CDN**: 全球边缘网络加速
- **预览部署**: 每个 PR 都会生成预览链接

---

## 🔧 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

---

## 📝 vercel.json 说明

项目已包含 `vercel.json` 配置文件：

- **区域**: 部署到香港区域 (`hkg1`) 以优化中国大陆访问
- **安全头**: 已配置基本的安全响应头
- **重写规则**: SPA 路由支持

---

## ⚡ 性能优化

Vercel 自动为 Next.js 提供：

- ✅ 自动代码分割
- ✅ 图片优化
- ✅ 字体优化
- ✅ 静态生成 (SSG)
- ✅ 边缘函数
- ✅ 缓存策略

---

## 🐛 常见问题

### 部署失败

1. 检查本地构建是否成功：`npm run build`
2. 查看 Vercel 部署日志
3. 确保所有依赖都在 `package.json` 中

### 构建超时

- `vercel.json` 中的 `regions` 设置为香港可能增加延迟
- 可以改为 `"regions": ["sin1"]` (新加坡) 或移除该行使用默认

---

## 📚 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
