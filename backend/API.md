# 智能简历分析平台 - API 接口文档

**Base URL**: `http://localhost:3001/api/v1`

---

## 1. 上传 PDF 文件

**接口**: `POST /upload`

**描述**: 上传 PDF 简历文件，系统自动解析提取文本内容

**请求格式**: `multipart/form-data`

### 请求参数

| 参数名 | 类型 | 必填 | 描述                |
| ------ | ---- | ---- | ------------------- |
| file   | File | 是   | PDF 文件，最大 10MB |

### 成功响应

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "file_abc123def456",
    "fileName": "张三_前端工程师.pdf",
    "content": "张三\n前端开发工程师\n\n联系方式\n手机：138xxxx1234\n...",
    "pageCount": 2,
    "fileSize": 245678
  }
}
```

### 错误响应

| code | message                          | 说明       |
| ---- | -------------------------------- | ---------- |
| 400  | 请选择文件上传                   | 未上传文件 |
| 400  | 请使用字段名"file"上传 PDF 文件  | 字段名错误 |
| 413  | 文件大小超过 10MB 限制           | 文件过大   |
| 415  | 仅支持 PDF 格式文件              | 格式错误   |
| 422  | PDF 解析失败，请检查文件是否损坏 | 解析异常   |

---

## 2. 提交文本内容

**接口**: `POST /upload/text`

**描述**: 直接提交简历文本内容

**请求格式**: `application/json`

### 请求参数

| 参数名  | 类型   | 必填 | 描述                         |
| ------- | ------ | ---- | ---------------------------- |
| content | string | 是   | 简历文本内容，100-20000 字符 |

### 请求示例

```json
{
  "content": "张三\n前端开发工程师\n\n联系方式\n手机：138xxxx1234..."
}
```

### 成功响应

```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "fileId": "text_abc123def456",
    "content": "张三\n前端开发工程师\n..."
  }
}
```

### 错误响应

| code | message                         | 说明     |
| ---- | ------------------------------- | -------- |
| 400  | 请提供简历文本内容              | 内容为空 |
| 400  | 文本长度需在 100-20000 字符之间 | 长度不符 |

---

## 响应格式说明

### 成功响应结构

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应结构

```json
{
  "code": 400,
  "message": "错误描述",
  "error": {
    "type": "ERROR_TYPE"
  }
}
```

---

## 前端调用示例

### 使用 fetch 上传文件

```javascript
const formData = new FormData();
formData.append("file", pdfFile);

const response = await fetch("http://localhost:3001/api/v1/upload", {
  method: "POST",
  body: formData,
});

const result = await response.json();
```

### 使用 axios 上传文件

```javascript
const formData = new FormData();
formData.append("file", pdfFile);

const response = await axios.post(
  "http://localhost:3001/api/v1/upload",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
```

### 提交文本

```javascript
const response = await fetch("http://localhost:3001/api/v1/upload/text", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ content: "简历内容..." }),
});
```

---

## 3. 开始分析

**接口**: `POST /analysis/start`

**描述**: 启动 AI 分析任务，系统会异步调用 DeepSeek API 分析简历

**请求格式**: `application/json`

### 请求参数

| 参数名         | 类型   | 必填 | 描述                         |
| -------------- | ------ | ---- | ---------------------------- |
| content        | string | 是   | 简历文本内容（至少 50 字符） |
| targetPosition | string | 否   | 目标岗位，默认"通用"         |

### 请求示例

```json
{
  "content": "张三\n前端开发工程师\n\n工作经历\n...",
  "targetPosition": "前端工程师"
}
```

### 成功响应

```json
{
  "code": 200,
  "message": "分析任务已创建",
  "data": {
    "analysisId": "analysis_abc123def456",
    "status": "pending",
    "estimatedTime": 30
  }
}
```

---

## 4. 查询分析进度

**接口**: `GET /analysis/:id/progress`

**描述**: 轮询查询分析任务进度

### 路径参数

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

### 成功响应

```json
{
  "code": 200,
  "data": {
    "status": "processing",
    "progress": 45,
    "currentStep": "技能提取",
    "steps": [
      { "name": "内容解析", "status": "completed" },
      { "name": "结构识别", "status": "completed" },
      { "name": "技能提取", "status": "processing" },
      { "name": "岗位匹配", "status": "pending" },
      { "name": "生成建议", "status": "pending" },
      { "name": "完成报告", "status": "pending" }
    ],
    "estimatedRemaining": 6
  }
}
```

### 状态说明

| status     | 描述     |
| ---------- | -------- |
| pending    | 等待处理 |
| processing | 处理中   |
| completed  | 已完成   |
| failed     | 失败     |

---

## 5. 获取分析结果

**接口**: `GET /analysis/:id/result`

**描述**: 获取完整的分析结果

### 路径参数

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

### 成功响应

```json
{
  "code": 200,
  "data": {
    "analysisId": "analysis_abc123def456",
    "createdAt": "2024-12-26T10:30:00Z",
    "targetPosition": "前端工程师",
    "overallScore": 78,
    "scoreLevel": "良好",
    "dimensions": [
      {
        "name": "内容完整性",
        "key": "completeness",
        "score": 85,
        "weight": 20,
        "comment": "基本信息完整"
      }
    ],
    "problems": [
      {
        "id": "p001",
        "type": "critical",
        "title": "工作经历缺乏量化数据",
        "description": "未提供具体成果数据",
        "location": "工作经历",
        "suggestion": "添加具体数据"
      }
    ],
    "suggestions": [
      {
        "id": "s001",
        "category": "工作经历",
        "priority": "high",
        "original": "负责公司官网开发",
        "optimized": "主导公司官网重构，性能提升65%",
        "reason": "添加量化成果"
      }
    ],
    "originalContent": "原始简历内容...",
    "optimizedContent": "优化后的简历内容..."
  }
}
```

### 错误响应

| code | message        | 说明           |
| ---- | -------------- | -------------- |
| 400  | 分析尚未完成   | 任务仍在处理中 |
| 404  | 分析任务不存在 | 任务 ID 无效   |
| 500  | 分析失败       | AI 分析出错    |

---

## 6. 采纳修改

**接口**: `POST /analysis/:id/accept`

**描述**: 采纳 AI 提供的优化建议，可选择采纳部分建议或全部采纳

**请求格式**: `application/json`

### 路径参数

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

### 请求参数

| 参数名        | 类型     | 必填 | 描述                         |
| ------------- | -------- | ---- | ---------------------------- |
| suggestionIds | string[] | 否   | 要采纳的建议 ID 列表         |
| acceptAll     | boolean  | 否   | 是否采纳全部建议，默认 false |

**注意**: `suggestionIds` 和 `acceptAll` 二选一

### 请求示例 - 采纳部分建议

```json
{
  "suggestionIds": ["s001", "s002"]
}
```

### 请求示例 - 采纳全部建议

```json
{
  "acceptAll": true
}
```

### 成功响应

```json
{
  "code": 200,
  "message": "修改已采纳",
  "data": {
    "acceptedCount": 2,
    "finalContent": "张三\n高级前端开发工程师\n\n工作经历\n主导公司官网重构项目，采用React + TypeScript技术栈，实现首屏加载时间从3.2s降至1.1s（提升65%）..."
  }
}
```

### 错误响应

| code | message                                           | 说明         |
| ---- | ------------------------------------------------- | ------------ |
| 400  | 请提供 suggestionIds 数组或设置 acceptAll 为 true | 参数缺失     |
| 400  | 分析尚未完成                                      | 任务未完成   |
| 404  | 分析任务不存在                                    | 任务 ID 无效 |
| 500  | 采纳修改失败                                      | 服务器错误   |

---

## 7. 同步分析（测试用）

**接口**: `POST /analysis/sync`

**描述**: 同步调用 AI 分析，直接返回结果（用于测试，响应时间较长）

**请求格式**: `application/json`

### 请求参数

| 参数名         | 类型   | 必填 | 描述                         |
| -------------- | ------ | ---- | ---------------------------- |
| content        | string | 是   | 简历文本内容（至少 50 字符） |
| targetPosition | string | 否   | 目标岗位，默认"通用"         |

### 请求示例

```json
{
  "content": "张三\n前端开发工程师\n\n工作经历\n...",
  "targetPosition": "前端工程师"
}
```

### 成功响应

```json
{
  "code": 200,
  "message": "分析完成",
  "data": {
    "overallScore": 78,
    "scoreLevel": "良好",
    "dimensions": [...],
    "problems": [...],
    "suggestions": [...],
    "optimizedContent": "优化后的简历内容..."
  }
}
```

---

## 前端调用流程

```
1. 上传PDF → 获取content
2. POST /analysis/start → 获取analysisId
3. 轮询 GET /analysis/:id/progress（每2秒）
4. status为completed时调用 GET /analysis/:id/result
5. 用户选择建议后调用 POST /analysis/:id/accept
```

---

## 8. 导出 PDF

**接口**: `GET /export/:id/pdf`

**描述**: 导出优化后的简历为 PDF 文件

### 路径参数

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

### 成功响应

- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="resume_optimized.pdf"`
- **Body**: PDF 文件二进制数据

### 错误响应

| code | message           | 说明         |
| ---- | ----------------- | ------------ |
| 400  | 请提供分析任务 ID | 参数缺失     |
| 400  | 分析尚未完成      | 任务未完成   |
| 404  | 分析任务不存在    | 任务 ID 无效 |
| 500  | 生成 PDF 失败     | 导出出错     |

### Apifox 测试示例

```
请求方式: GET
请求URL: http://localhost:3001/api/v1/export/{analysisId}/pdf

示例: http://localhost:3001/api/v1/export/analysis_abc123def456/pdf

响应: 下载 PDF 文件
```

---

## 9. 导出 Markdown

**接口**: `GET /export/:id/markdown`

**描述**: 导出优化后的简历为 Markdown 文件

### 路径参数

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

### 成功响应

- **Content-Type**: `text/markdown; charset=utf-8`
- **Content-Disposition**: `attachment; filename="resume_optimized.md"`
- **Body**: Markdown 文本内容

### 响应内容示例

```markdown
# 优化后的简历

**综合评分**: 78/100 (良好)

---

张三
高级前端开发工程师
...

---

## 分析维度

- **内容完整性**: 85 分 - 基本信息完整
- **表达专业性**: 72 分 - 部分描述需要优化

## 问题诊断

### 🔴 工作经历缺乏量化数据

- **位置**: 工作经历
- **描述**: 未提供具体成果数据
- **建议**: 添加具体数据

## 优化建议

### 工作经历

**原文**: 负责公司官网开发

**优化后**: 主导公司官网重构，性能提升 65%

_添加量化成果_
```

### 错误响应

| code | message            | 说明         |
| ---- | ------------------ | ------------ |
| 400  | 请提供分析任务 ID  | 参数缺失     |
| 400  | 分析尚未完成       | 任务未完成   |
| 404  | 分析任务不存在     | 任务 ID 无效 |
| 500  | 生成 Markdown 失败 | 导出出错     |

### Apifox 测试示例

```
请求方式: GET
请求URL: http://localhost:3001/api/v1/export/{analysisId}/markdown

示例: http://localhost:3001/api/v1/export/analysis_abc123def456/markdown

响应: 下载 Markdown 文件
```

---

## 接口汇总

| 方法 | 路径                   | 描述          |
| ---- | ---------------------- | ------------- |
| POST | /upload                | 上传 PDF 文件 |
| POST | /upload/text           | 提交文本内容  |
| POST | /analysis/start        | 开始分析      |
| POST | /analysis/sync         | 同步分析      |
| GET  | /analysis/:id/progress | 查询进度      |
| GET  | /analysis/:id/result   | 获取结果      |
| POST | /analysis/:id/accept   | 采纳修改      |
| GET  | /export/:id/pdf        | 导出 PDF 文件 |
| GET  | /export/:id/markdown   | 导出 Markdown |
