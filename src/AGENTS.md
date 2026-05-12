# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts

## 项目说明

LXJM具身智能设备管理平台 - 面向工业制造场景的智能设备统一管控系统，包含5大核心模块：

1. **仪表盘** - 数据概览、趋势图表、设备状态实时监控
2. **算法管理** - 机器狗视觉检测算法的模型管理与版本控制
3. **地图管理** - 车间地图的创建、编辑与区域规划
4. **设备管理** - 机器狗及附属设备的注册、状态监控与运维
5. **任务管理** - 巡检、监测任务的创建、执行与报告
6. **告警管理** - 异常告警的实时推送与处理闭环

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── layout.tsx      # 全局布局（侧边栏+顶栏+状态栏）
│   │   ├── page.tsx        # 仪表盘首页
│   │   ├── algorithms/     # 算法管理页面
│   │   ├── maps/           # 地图管理页面
│   │   ├── devices/        # 设备管理页面
│   │   ├── tasks/          # 任务管理页面
│   │   └── alerts/         # 告警管理页面
│   ├── components/         # 业务组件
│   │   ├── app-sidebar.tsx # 左侧导航栏
│   │   ├── app-header.tsx  # 顶部操作栏
│   │   ├── status-bar.tsx  # 底部状态栏
│   │   └── ui/             # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   ├── utils.ts        # 通用工具函数 (cn)
│   │   └── mock-data.ts    # 模拟数据与类型定义
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**

## 关键数据模型

核心类型定义在 `src/lib/mock-data.ts`，包括：
- `Algorithm` - 算法模型（算法类型、版本、性能指标、状态）
- `MapItem` - 地图（类型、尺寸、点位/线路/区域数量、状态）
- `Device` - 设备（类型、状态、电量、位置、附属设备）
- `Task` - 任务（类型、步骤、进度、执行设备、报告）
- `Alert` - 告警（级别、类型、处理状态、关联设备）
