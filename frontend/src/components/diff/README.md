# Diff 组件 (Diff Components)

负责展示简历修改前后对比的组件模块。

## 组件列表

- **DiffViewer/**: 核心对比视图组件，封装了 `react-diff-viewer-continued`，支持双栏/单栏切换和代码高亮。
- **DiffControls/**: 修改控制面板，列出所有变更点，支持逐条采纳/拒绝、全部采纳、重置等操作。
- **DiffStats/**: 变更统计组件，展示新增、删除、修改的行数统计。
