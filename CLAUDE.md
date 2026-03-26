# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个基于 Next.js 16 构建的交互式情绪发泄平台（"发泄一下"），使用 React 19、TypeScript 和 Tailwind CSS v4。应用提供多种方式让用户通过文字、点击、涂鸦和 AI 焦虑发泄来表达和释放情绪，配有视觉爆炸效果和游戏化系统。

## 开发命令

```bash
# 启动开发服务器（端口 0 表示自动分配端口）
npm run dev

# 生产环境构建
npm run build

# 启动生产服务器
npm start

# 运行 ESLint
npm run lint
```

## 架构设计

### 核心应用结构

**主页面** (`app/page.tsx`): 客户端组件，管理所有视图和状态。包含主要应用逻辑：
- 视图路由（发泄、狂点、涂鸦、AI 焦虑、报告、日历、成就）
- 发泄记录和成就的 LocalStorage 持久化
- 爆炸特效编排
- 音效协调

**状态管理：**
- 所有状态在主页面组件中使用 React hooks 管理
- 数据通过 localStorage 持久化（`vents`、`achievements`、`soundEnabled`）
- 不使用外部状态管理库

### 组件组织

**位置：** 所有组件位于 `app/components/`

**视图组件**（功能完整的交互模式）：
- `RageClick.tsx` - 基于点击的发泄，计算愤怒值
- `AIAxiety.tsx` - AI 焦虑专用发泄界面
- `CanvasDraw.tsx` - 涂鸦画板，支持画笔/橡皮擦
- `EmotionReport.tsx` - 数据可视化和情绪洞察
- `CalendarView.tsx` - 按日期展示发泄历史的日历

**UI 组件：**
- `TagSystem.tsx` - 标签创建和筛选
- `ExplosionSVG.tsx`、`ShockwaveSVG.tsx`、`FireExplosionSVG.tsx` - 视觉特效组件

**未实现：**
- `MirrorMode.tsx` - 计划中的 AI 聊天界面（尚未集成）

### 自定义 Hooks

**位置：** `app/hooks/`

- `useSoundEffects.ts` - Web Audio API 程序化音效生成（爆炸、点击、成就音效）
- `useAchievements.ts` - 成就追踪，支持 localStorage 持久化

### 数据模型

**VentEntry**（定义于 `app/page.tsx`）：
```typescript
interface VentEntry {
  id: string
  timestamp: number
  content: string
  intensity: number  // 1-5
  tags?: string[]
}
```

**Achievement**（定义于 `app/hooks/useAchievements.ts`）：
```typescript
interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  progress: number
  target: number
}
```

### 视觉特效系统

特效通过 `triggerExplosion()` 函数触发，编排以下效果：
- **彩带** - canvas-confetti 库，基于强度参数调整
- **SVG 特效** - React 组件（`ExplosionSVG`、`ShockwaveSVG`、`FireExplosionSVG`）
- **屏幕特效** - CSS 动画（震动、闪烁）
- 特效可通过 `effectType` 状态组合或单独选择

### 样式系统

- **Tailwind CSS v4**，在 `app/globals.css` 中配置内联主题
- **自定义动画** 定义为 CSS keyframes：`shake`、`flash`、`fade-in-up`
- **配色方案**：深色渐变背景（`from-gray-900 via-red-900 to-gray-900`）
- **字体**：通过 `next/font/google` 使用 Geist Sans 和 Geist Mono

## 重要模式

### 添加新视图

1. 在 `app/page.tsx` 的类型定义中添加新的 `ViewType`
2. 在视图导航网格中添加导航按钮
3. 创建条件渲染块：`{currentView === 'new-view' && <NewViewComponent />}`
4. 传递必要的回调函数（如 `onComplete`）处理视图切换

### 特效组件模式

视觉特效组件应该：
- 接受 `intensity` 属性（1-5）
- 使用固定定位和高 z-index
- 动画完成后自动隐藏
- 从主页面状态条件渲染

### 音效系统

所有音效通过 Web Audio API 程序化生成（无音频文件）：
- 爆炸音效根据强度变化
- 仅在 `soundEnabled` 状态为 true 时播放
- 偏好设置保存在 localStorage

## gstack

本项目使用 gstack 进行 AI 工程工作流。

## 网页浏览

**始终使用 gstack 的 `/browse` 技能进行网页浏览。** 绝不使用 `mcp__claude-in-chrome__*` 工具 — 它们速度慢、不可靠，不是本项目使用的工具。

## 可用技能

- `/office-hours` — YC 办公时间（创业诊断 + 构思头脑风暴）
- `/plan-ceo-review` — CEO/创始人模式计划评审
- `/plan-eng-review` — 工程经理模式计划评审（架构、数据流、图表、边界情况、测试覆盖、性能）
- `/plan-design-review` — 设计师视角计划评审
- `/design-consultation` — 从零开始设计系统
- `/review` — 合并前 PR 评审
- `/ship` — 发布工作流（检测 + 合并基础分支、运行测试、评审差异、更新 VERSION、更新 CHANGELOG、提交、推送、创建 PR）
- `/land-and-deploy` — 合并和部署工作流（合并 PR、等待 CI 和部署、通过金丝雀检查验证生产健康）
- `/canary` — 部署后金丝雀监控
- `/benchmark` — 性能回归检测
- `/browse` — 快速无头浏览器，用于 QA 测试和站点内测
- `/qa` — 系统化 QA 测试 Web 应用并修复发现的 bug
- `/qa-only` — 仅报告 QA 测试（不修复）
- `/design-review` — 设计师视角 QA（发现视觉不一致、间距问题、层级问题、AI 糟糕模式）
- `/setup-browser-cookies` — 将真实浏览器的 cookies 导入无头浏览会话
- `/setup-deploy` — 配置 /land-and-deploy 的部署设置
- `/retro` — 每周工程回顾
- `/investigate` — 系统化调试，进行根因分析
- `/document-release` — 发布后文档更新
- `/codex` — OpenAI Codex CLI 包装器（代码评审、挑战、咨询）
- `/cso` — 首席安全官模式（基础设施优先的安全审计）
- `/careful` — 破坏性命令的安全护栏
- `/freeze` — 限制文件编辑到特定目录
- `/guard` — 完全安全模式（破坏性命令警告 + 目录范围编辑）
- `/unfreeze` — 清除 /freeze 设置的冻结边界
- `/gstack-upgrade` — 升级 gstack 到最新版本

## 故障排除

如果 gstack 技能不工作，运行设置脚本构建二进制文件并注册技能：

```bash
cd .claude/skills/gstack && ./setup
```

这需要安装 bun（`curl -fsSL https://bun.sh/install | bash`）。
