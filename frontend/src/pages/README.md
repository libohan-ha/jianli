# 页面组件 (Pages)

对应路由的页面级组件。

## 页面列表

- **HomePage/**: 首页 (`/`)，包含上传区域和文本输入区域，负责初始化分析任务。
- **AnalyzingPage/**: 分析中页面 (`/analyzing`)，展示分析进度条和当前执行步骤。
- **ResultPage/**: 分析结果页 (`/result/:id`)，展示评分、问题和建议概览。
- **DiffPage/**: 差异对比页 (`/diff/:id`)，提供详细的简历修改对比视图和操作。
- **ExportPage/**: 导出预览页 (`/export/:id`)，支持预览和下载 PDF/Markdown 文件。
