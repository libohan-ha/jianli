# 智能简历分析平台 - 前端项目说明

本项目是智能简历分析平台的 React 前端实现。以下是项目各模块的详细说明。

## 1. 源码根目录 (`src/`)

- **assets/**: 静态资源文件（图片、图标等）。
- **components/**: React 组件库，按功能模块分类。
- **pages/**: 应用的页面级组件，对应路由配置。
- **stores/**: 全局状态管理 (Zustand)。
- **services/**: API 接口服务和 HTTP 请求封装。
- **types/**: TypeScript 类型定义文件。
- **mocks/**: 模拟数据和测试辅助函数。
- **App.tsx**: 应用根组件，包含路由和全局 Provider 配置。
- **main.tsx**: 应用入口文件，负责渲染 React 根节点。
- **router.tsx**: 路由配置文件。

---

## 2. 组件库 (`src/components/`)

### 2.1 目录分类

- **common/**: 通用基础组件，不依赖具体业务逻辑。
- **upload/**: 简历上传相关组件。
- **analysis/**: 简历分析结果展示组件。
- **diff/**: 简历差异对比相关组件。

### 2.2 通用组件 (`common/`)

- **Button/**: 封装的按钮组件，支持多种变体 (primary, outline, ghost) 和加载状态。
- **Header/**: 全局顶部导航栏，包含 Logo 和操作按钮。
- **Footer/**: 全局底部页脚。
- **Loading/**: 加载状态指示器。
- **Modal/**: 通用模态框组件，支持键盘 ESC 关闭和遮罩层点击关闭。

### 2.3 上传组件 (`upload/`)

- **FileDropzone/**: 文件拖拽上传区域，封装了 `react-dropzone`，支持 PDF 文件验证和拖拽交互。
- **TextInput/**: 多行文本输入区域，用于用户直接粘贴简历内容。

### 2.4 分析组件 (`analysis/`)

- **ScoreCard/**: 综合评分卡片，使用环形进度条展示总分和评级。
- **RadarChart/**: 维度评分雷达图，基于 `recharts` 展示 5 个维度的能力分布。
- **ProblemList/**: 简历问题列表，按严重程度（严重/中等/建议）分类展示。
- **SuggestionList/**: 优化建议列表，展示原文、修改建议和修改原因。

### 2.5 Diff 组件 (`diff/`)

- **DiffViewer/**: 核心对比视图组件，封装了 `react-diff-viewer-continued`，支持双栏/单栏切换和代码高亮。
- **DiffControls/**: 修改控制面板，列出所有变更点，支持逐条采纳/拒绝、全部采纳、重置等操作。
- **DiffStats/**: 变更统计组件，展示新增、删除、修改的行数统计。

---

## 3. 页面组件 (`src/pages/`)

- **HomePage/**: 首页 (`/`)，包含上传区域和文本输入区域，负责初始化分析任务。
- **AnalyzingPage/**: 分析中页面 (`/analyzing`)，展示分析进度条和当前执行步骤。
- **ResultPage/**: 分析结果页 (`/result/:id`)，展示评分、问题和建议概览。
- **DiffPage/**: 差异对比页 (`/diff/:id`)，提供详细的简历修改对比视图和操作。
- **ExportPage/**: 导出预览页 (`/export/:id`)，支持预览和下载 PDF/Markdown 文件。

---

## 4. 状态管理 (`src/stores/`)

使用 Zustand 库管理的全局应用状态。

- **useAppStore.ts**: 管理应用级通用状态，如用户信息、全局加载状态等。
- **useAnalysisStore.ts**: 管理核心业务流程状态，包括简历分析进度、结果数据、Diff 变更状态及导出配置。

---

## 5. 服务层 (`src/services/`)

负责与后端及其它外部服务进行交互的逻辑封装。

- **api.ts**: Axios 实例的封装，配置了全局的请求拦截器和响应拦截器，处理统一的错误提示。
- **uploadService.ts**: 封装文件上传相关的 API 请求及文件格式验证逻辑。
- **analysisService.ts**: 封装简历分析相关的 API 请求（如启动分析、查询进度、获取结果）以及轮询进度的 helper 函数。

---

## 6. 类型定义 (`src/types/`)

存放项目中使用的 TypeScript 接口和类型声明。

- **analysis.ts**: 定义简历分析相关的核心类型（如评分、问题、建议、Diff 变更、分析结果）。
- **common.ts**: 定义应用级通用类型（如用户信息、API 响应格式、基础 UI 属性）。
- **index.ts**: 统一导出所有类型，方便其他模块引用。

---

## 7. 模拟数据 (`src/mocks/`)

用于前端独立开发和测试的模拟数据，支持在无后端接口的情况下跑通完整业务流程。

- **mockData.ts**: 包含两部分：
  1.  **mockAnalysisResult**: 一个完整的简历分析结果对象，包含评分、维度分析、问题列表、优化建议及修改前后的简历内容。
  2.  **simulateProgress**: 一个辅助函数，用于模拟耗时的异步分析过程，通过回调函数逐步更新进度和步骤状态，最终返回分析结果。
