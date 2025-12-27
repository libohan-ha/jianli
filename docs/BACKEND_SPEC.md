# 智能简历分析平台 - 后端技术规格文档

**文档版本**: v1.0  
**创建日期**: 2024 年 12 月 26 日  
**目标读者**: 后端开发组  
**技术栈**: Node.js + Express + TypeScript

---

## 目录

1. [技术栈选型](#1-技术栈选型)
2. [项目结构规范](#2-项目结构规范)
3. [API 接口设计](#3-api接口设计)
4. [数据库设计](#4-数据库设计)
5. [第三方服务集成](#5-第三方服务集成)
6. [文件处理模块](#6-文件处理模块)
7. [错误处理规范](#7-错误处理规范)
8. [安全设计](#8-安全设计)
9. [部署运维](#9-部署运维)

---

## 1. 技术栈选型

### 1.1 核心框架与工具

| 技术       | 版本     | 用途       |
| ---------- | -------- | ---------- |
| Node.js    | 20.x LTS | 运行时环境 |
| Express    | 4.x      | Web 框架   |
| TypeScript | 5.x      | 类型系统   |
| PostgreSQL | 15.x     | 主数据库   |
| Redis      | 7.x      | 缓存/队列  |
| Bull       | 4.x      | 任务队列   |

### 1.2 功能性依赖

| 依赖         | 用途           |
| ------------ | -------------- |
| pdf-parse    | PDF 文本提取   |
| openai       | OpenAI API SDK |
| multer       | 文件上传中间件 |
| pdfkit       | PDF 生成       |
| marked       | Markdown 转换  |
| joi          | 请求参数校验   |
| winston      | 日志记录       |
| helmet       | 安全中间件     |
| cors         | 跨域处理       |
| jsonwebtoken | JWT 认证       |
| bcrypt       | 密码加密       |

---

## 2. 项目结构规范

```
src/
├── config/                 # 配置文件
│   ├── index.ts           # 主配置导出
│   ├── database.ts        # 数据库配置
│   ├── redis.ts           # Redis配置
│   └── llm.ts             # LLM服务配置
├── controllers/           # 控制器层
│   ├── uploadController.ts
│   ├── analysisController.ts
│   └── exportController.ts
├── services/              # 业务逻辑层
│   ├── fileService.ts     # 文件处理服务
│   ├── analysisService.ts # 分析服务
│   ├── llmService.ts      # LLM调用服务
│   └── exportService.ts   # 导出服务
├── models/                # 数据模型
│   ├── Analysis.ts
│   ├── User.ts
│   └── File.ts
├── middlewares/           # 中间件
│   ├── auth.ts            # 认证中间件
│   ├── upload.ts          # 上传中间件
│   ├── errorHandler.ts    # 错误处理
│   ├── rateLimiter.ts     # 限流
│   └── validator.ts       # 参数校验
├── routes/                # 路由定义
│   ├── index.ts
│   ├── upload.ts
│   ├── analysis.ts
│   └── export.ts
├── queues/                # 任务队列
│   ├── analysisQueue.ts   # 分析任务队列
│   └── processor.ts       # 队列处理器
├── utils/                 # 工具函数
│   ├── logger.ts
│   ├── response.ts
│   └── pdf.ts
├── types/                 # 类型定义
│   ├── analysis.ts
│   └── common.ts
├── prompts/               # AI Prompt模板
│   └── resumeAnalysis.ts
├── app.ts                 # 应用入口
└── server.ts              # 服务器启动
```

---

## 3. API 接口设计

### 3.1 接口总览

| 模块 | 接口     | 方法 | 路径                            | 描述             |
| ---- | -------- | ---- | ------------------------------- | ---------------- |
| 上传 | 上传文件 | POST | `/api/v1/upload`                | 上传 PDF 并解析  |
| 上传 | 文本输入 | POST | `/api/v1/upload/text`           | 直接提交文本     |
| 分析 | 开始分析 | POST | `/api/v1/analysis/start`        | 启动 AI 分析任务 |
| 分析 | 查询进度 | GET  | `/api/v1/analysis/:id/progress` | 轮询分析进度     |
| 分析 | 获取结果 | GET  | `/api/v1/analysis/:id/result`   | 获取完整结果     |
| 分析 | 采纳修改 | POST | `/api/v1/analysis/:id/accept`   | 采纳优化建议     |
| 导出 | 导出 PDF | GET  | `/api/v1/export/:id/pdf`        | 生成 PDF 文件    |
| 导出 | 导出 MD  | GET  | `/api/v1/export/:id/markdown`   | 生成 Markdown    |

---

### 3.2 接口详细设计

#### 3.2.1 上传文件接口

**基本信息**

```
POST /api/v1/upload
Content-Type: multipart/form-data
```

**请求参数**

| 参数名 | 类型 | 必填 | 描述     | 限制                   |
| ------ | ---- | ---- | -------- | ---------------------- |
| file   | File | 是   | PDF 文件 | 最大 10MB，仅 PDF 格式 |

**请求示例**

```
POST /api/v1/upload
Content-Type: multipart/form-data

file: [简历.pdf]
```

**响应参数**

| 参数名         | 类型   | 描述            |
| -------------- | ------ | --------------- |
| code           | number | 状态码          |
| message        | string | 状态描述        |
| data.fileId    | string | 文件唯一标识    |
| data.fileName  | string | 原始文件名      |
| data.content   | string | 提取的文本内容  |
| data.pageCount | number | PDF 页数        |
| data.fileSize  | number | 文件大小(bytes) |

**成功响应示例**

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "file_abc123def456",
    "fileName": "张三_前端工程师.pdf",
    "content": "张三\n前端开发工程师\n\n联系方式\n手机：138xxxx1234\n邮箱：zhangsan@email.com\n\n工作经历\n...",
    "pageCount": 2,
    "fileSize": 245678
  }
}
```

**错误响应**

| code | message                          | 说明       |
| ---- | -------------------------------- | ---------- |
| 400  | 请选择文件上传                   | 未上传文件 |
| 413  | 文件大小超过 10MB 限制           | 文件过大   |
| 415  | 仅支持 PDF 格式文件              | 格式错误   |
| 422  | PDF 解析失败，请检查文件是否损坏 | 解析异常   |

---

#### 3.2.2 文本输入接口

**基本信息**

```
POST /api/v1/upload/text
Content-Type: application/json
```

**请求参数**

| 参数名  | 类型   | 必填 | 描述         | 限制                |
| ------- | ------ | ---- | ------------ | ------------------- |
| content | string | 是   | 简历文本内容 | 长度 100-20000 字符 |

**请求示例**

```json
{
  "content": "张三\n前端开发工程师\n\n联系方式\n手机：138xxxx1234..."
}
```

**成功响应示例**

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

---

#### 3.2.3 开始分析接口

**基本信息**

```
POST /api/v1/analysis/start
Content-Type: application/json
```

**请求参数**

| 参数名         | 类型   | 必填   | 描述                  |
| -------------- | ------ | ------ | --------------------- |
| fileId         | string | 二选一 | 上传接口返回的 fileId |
| content        | string | 二选一 | 直接提交的文本内容    |
| targetPosition | string | 否     | 目标岗位，默认"通用"  |

**请求示例**

```json
{
  "fileId": "file_abc123def456",
  "targetPosition": "前端工程师"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "分析任务已创建",
  "data": {
    "analysisId": "analysis_xyz789",
    "status": "pending",
    "estimatedTime": 30
  }
}
```

**业务逻辑说明**

1. 接收请求后，创建分析记录，状态为`pending`
2. 将任务推入分析队列（Bull Queue）
3. 立即返回 analysisId 给前端
4. 前端通过进度查询接口轮询状态

---

#### 3.2.4 查询进度接口

**基本信息**

```
GET /api/v1/analysis/:id/progress
```

**路径参数**

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

**响应参数**

| 参数名      | 类型   | 描述             |
| ----------- | ------ | ---------------- |
| status      | string | 任务状态         |
| progress    | number | 进度百分比 0-100 |
| currentStep | string | 当前步骤描述     |
| steps       | array  | 所有步骤及状态   |

**成功响应示例**

```json
{
  "code": 200,
  "data": {
    "status": "processing",
    "progress": 45,
    "currentStep": "正在提取技能关键词...",
    "steps": [
      { "name": "内容解析", "status": "completed" },
      { "name": "结构识别", "status": "completed" },
      { "name": "技能提取", "status": "processing" },
      { "name": "岗位匹配", "status": "pending" },
      { "name": "生成建议", "status": "pending" },
      { "name": "完成报告", "status": "pending" }
    ],
    "estimatedRemaining": 15
  }
}
```

**状态枚举值**

| status     | 描述     |
| ---------- | -------- |
| pending    | 等待处理 |
| processing | 处理中   |
| completed  | 已完成   |
| failed     | 失败     |

**前端轮询建议**

- 轮询间隔：2 秒
- 状态为`completed`或`failed`时停止轮询
- 最大轮询次数：60 次（2 分钟超时）

---

#### 3.2.5 获取结果接口

**基本信息**

```
GET /api/v1/analysis/:id/result
```

**路径参数**

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

**成功响应示例**

```json
{
  "code": 200,
  "data": {
    "analysisId": "analysis_xyz789",
    "createdAt": "2024-12-26T10:30:00Z",
    "targetPosition": "前端工程师",

    "overallScore": 78,
    "scoreLevel": "良好",
    "percentile": 65,

    "dimensions": [
      {
        "name": "内容完整性",
        "key": "completeness",
        "score": 85,
        "weight": 20,
        "comment": "基本信息、教育背景、工作经历等主要模块完整，建议补充个人技术博客或GitHub链接"
      },
      {
        "name": "表达清晰度",
        "key": "clarity",
        "score": 75,
        "weight": 25,
        "comment": "整体表达较清晰，部分工作经历描述可以更加简洁有力"
      },
      {
        "name": "量化成果",
        "key": "quantification",
        "score": 68,
        "weight": 25,
        "comment": "缺乏具体数据支撑，建议添加性能优化百分比、业务增长数据等"
      },
      {
        "name": "关键词匹配",
        "key": "keywords",
        "score": 70,
        "weight": 15,
        "comment": "与前端工程师岗位匹配度一般，建议突出React/Vue等主流框架经验"
      },
      {
        "name": "格式规范",
        "key": "format",
        "score": 80,
        "weight": 15,
        "comment": "排版整齐，层次分明，日期格式可统一为YYYY.MM格式"
      }
    ],

    "problems": [
      {
        "id": "p001",
        "type": "critical",
        "title": "工作经历缺乏量化数据",
        "description": "第一段工作经历仅描述了职责，未提供具体的成果数据，如性能提升比例、用户增长等",
        "location": "工作经历 - XX科技公司",
        "suggestion": "使用STAR法则重新组织，添加具体的量化成果"
      },
      {
        "id": "p002",
        "type": "major",
        "title": "技能描述过于笼统",
        "description": "'熟悉前端开发'这样的描述过于宽泛，无法体现技术深度",
        "location": "技能清单",
        "suggestion": "具体列出掌握的技术栈及熟练程度，如'精通React，熟悉Vue'"
      },
      {
        "id": "p003",
        "type": "minor",
        "title": "缺少个人项目/开源贡献",
        "description": "对于前端岗位，个人项目或GitHub贡献能够很好地展示技术热情和实际能力",
        "location": "无",
        "suggestion": "建议添加个人技术博客、GitHub主页或开源项目链接"
      }
    ],

    "suggestions": [
      {
        "id": "s001",
        "category": "工作经历",
        "priority": "high",
        "original": "负责公司官网的开发和维护工作",
        "optimized": "主导公司官网重构项目，采用React + TypeScript技术栈，实现首屏加载时间从3.2s降至1.1s（提升65%），支撑日均PV从5万增长至12万",
        "reason": "使用STAR描述法，添加具体技术栈和量化成果，突出个人贡献"
      },
      {
        "id": "s002",
        "category": "工作经历",
        "priority": "high",
        "original": "参与多个项目的前端开发",
        "optimized": "负责3个核心业务系统的前端架构设计与开发，建立组件库规范，组件复用率提升至80%，开发效率提升40%",
        "reason": "量化项目数量和成果，体现架构能力和团队影响力"
      },
      {
        "id": "s003",
        "category": "技能描述",
        "priority": "medium",
        "original": "熟悉前端开发",
        "optimized": "前端技术栈：精通React/Vue框架，熟练使用TypeScript，掌握Webpack/Vite构建工具配置，了解Node.js后端开发",
        "reason": "具体技术分层描述，使用精通/熟练/掌握/了解体现不同熟练度"
      },
      {
        "id": "s004",
        "category": "个人信息",
        "priority": "low",
        "original": "（无）",
        "optimized": "GitHub: github.com/zhangsan  |  技术博客: blog.zhangsan.dev",
        "reason": "添加技术影响力证明，展示持续学习能力"
      }
    ],

    "originalContent": "张三\n前端开发工程师\n\n联系方式\n...(原始完整内容)",

    "optimizedContent": "张三\n高级前端开发工程师\n\n联系方式\n手机：138xxxx1234\n邮箱：zhangsan@email.com\nGitHub：github.com/zhangsan\n\n工作经历\n\nXX科技公司 | 前端技术负责人 | 2022.03 - 至今\n• 主导公司官网重构项目，采用React + TypeScript技术栈...(完整优化内容)"
  }
}
```

**问题类型枚举**

| type     | 描述          | 显示颜色 |
| -------- | ------------- | -------- |
| critical | 严重问题      | 红色     |
| major    | 主要问题      | 橙色     |
| minor    | 次要问题/建议 | 蓝色     |

---

#### 3.2.6 采纳修改接口

**基本信息**

```
POST /api/v1/analysis/:id/accept
Content-Type: application/json
```

**请求参数**

| 参数名        | 类型     | 必填 | 描述                     |
| ------------- | -------- | ---- | ------------------------ |
| suggestionIds | string[] | 是   | 采纳的建议 ID 列表       |
| acceptAll     | boolean  | 否   | 是否采纳全部，默认 false |

**请求示例**

```json
{
  "suggestionIds": ["s001", "s002", "s003"],
  "acceptAll": false
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "修改已采纳",
  "data": {
    "acceptedCount": 3,
    "finalContent": "张三\n高级前端开发工程师\n...(合并后的最终内容)"
  }
}
```

---

#### 3.2.7 导出 PDF 接口

**基本信息**

```
GET /api/v1/export/:id/pdf
```

**路径参数**

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

**查询参数**

| 参数名   | 类型   | 必填 | 描述                  |
| -------- | ------ | ---- | --------------------- |
| template | string | 否   | 模板名称，默认 simple |

**可用模板**

| template | 描述             |
| -------- | ---------------- |
| simple   | 简洁专业（默认） |
| creative | 创意设计         |
| academic | 学术风格         |

**响应**

- Content-Type: application/pdf
- Content-Disposition: attachment; filename="resume_optimized.pdf"

**成功响应**: 直接返回 PDF 文件流

---

#### 3.2.8 导出 Markdown 接口

**基本信息**

```
GET /api/v1/export/:id/markdown
```

**路径参数**

| 参数名 | 类型   | 描述        |
| ------ | ------ | ----------- |
| id     | string | 分析任务 ID |

**响应**

- Content-Type: text/markdown
- Content-Disposition: attachment; filename="resume_optimized.md"

**成功响应**: 直接返回 Markdown 文件内容

---

## 4. 数据库设计

### 4.1 数据库选型

- **主数据库**: PostgreSQL 15
- **缓存**: Redis 7

### 4.2 表结构设计

#### 4.2.1 用户表 (users)

| 字段名        | 类型         | 约束             | 描述     |
| ------------- | ------------ | ---------------- | -------- |
| id            | UUID         | PRIMARY KEY      | 用户 ID  |
| email         | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱     |
| password_hash | VARCHAR(255) | NOT NULL         | 密码哈希 |
| nickname      | VARCHAR(100) |                  | 昵称     |
| avatar_url    | VARCHAR(500) |                  | 头像 URL |
| created_at    | TIMESTAMP    | DEFAULT NOW()    | 创建时间 |
| updated_at    | TIMESTAMP    | DEFAULT NOW()    | 更新时间 |

#### 4.2.2 文件表 (files)

| 字段名      | 类型         | 约束          | 描述                  |
| ----------- | ------------ | ------------- | --------------------- |
| id          | VARCHAR(50)  | PRIMARY KEY   | 文件 ID (file_xxx)    |
| user_id     | UUID         | FOREIGN KEY   | 关联用户（可为空）    |
| file_name   | VARCHAR(255) | NOT NULL      | 原始文件名            |
| file_size   | INTEGER      | NOT NULL      | 文件大小(bytes)       |
| file_path   | VARCHAR(500) |               | 存储路径              |
| content     | TEXT         | NOT NULL      | 提取的文本内容        |
| source_type | VARCHAR(20)  | NOT NULL      | 来源类型: upload/text |
| page_count  | INTEGER      |               | PDF 页数              |
| created_at  | TIMESTAMP    | DEFAULT NOW() | 创建时间              |
| expires_at  | TIMESTAMP    |               | 过期时间              |

**索引**:

- idx_files_user_id (user_id)
- idx_files_created_at (created_at)

#### 4.2.3 分析记录表 (analyses)

| 字段名               | 类型         | 约束          | 描述                   |
| -------------------- | ------------ | ------------- | ---------------------- |
| id                   | VARCHAR(50)  | PRIMARY KEY   | 分析 ID (analysis_xxx) |
| file_id              | VARCHAR(50)  | FOREIGN KEY   | 关联文件               |
| user_id              | UUID         | FOREIGN KEY   | 关联用户（可为空）     |
| target_position      | VARCHAR(100) |               | 目标岗位               |
| status               | VARCHAR(20)  | NOT NULL      | 状态                   |
| progress             | INTEGER      | DEFAULT 0     | 进度 0-100             |
| current_step         | VARCHAR(100) |               | 当前步骤描述           |
| overall_score        | INTEGER      |               | 总分                   |
| score_level          | VARCHAR(20)  |               | 评级                   |
| dimensions           | JSONB        |               | 维度评分               |
| problems             | JSONB        |               | 问题列表               |
| suggestions          | JSONB        |               | 建议列表               |
| original_content     | TEXT         |               | 原始内容               |
| optimized_content    | TEXT         |               | 优化后内容             |
| final_content        | TEXT         |               | 最终采纳内容           |
| accepted_suggestions | TEXT[]       |               | 已采纳建议 ID 列表     |
| llm_model            | VARCHAR(50)  |               | 使用的模型             |
| llm_tokens           | INTEGER      |               | 消耗的 Token 数        |
| error_message        | TEXT         |               | 错误信息               |
| started_at           | TIMESTAMP    |               | 开始分析时间           |
| completed_at         | TIMESTAMP    |               | 完成时间               |
| created_at           | TIMESTAMP    | DEFAULT NOW() | 创建时间               |
| updated_at           | TIMESTAMP    | DEFAULT NOW() | 更新时间               |

**索引**:

- idx_analyses_user_id (user_id)
- idx_analyses_status (status)
- idx_analyses_created_at (created_at)

### 4.3 Redis 数据结构

#### 分析进度缓存

```
Key: analysis:progress:{analysisId}
Type: Hash
Fields:
  - status: string
  - progress: number
  - currentStep: string
  - steps: JSON string
TTL: 1小时
```

#### 分析结果缓存

```
Key: analysis:result:{analysisId}
Type: String (JSON)
Value: 完整分析结果JSON
TTL: 24小时
```

---

## 5. 第三方服务集成

### 5.1 LLM 服务配置

#### 支持的服务商

| 服务商   | 模型                | 优先级 | 说明     |
| -------- | ------------------- | ------ | -------- |
| OpenAI   | gpt-4 / gpt-4-turbo | 主选   | 效果最好 |
| DeepSeek | deepseek-chat       | 备选   | 性价比高 |

#### 配置参数

```
LLM配置:
  - model: gpt-4-turbo-preview
  - temperature: 0.3 (保持输出稳定)
  - max_tokens: 4000
  - timeout: 60秒
  - retry: 3次
  - retry_delay: 1秒 (指数退避)
```

### 5.2 Prompt 模板设计

#### 系统 Prompt

```
你是一位拥有10年招聘经验的资深HR，专注于互联网/科技行业人才招聘。

你的任务是从专业招聘者的视角，对候选人的简历进行深度分析，提供：
1. 综合评分（1-100分）和各维度细分评分
2. 发现的主要问题及改进建议
3. 具体的优化后文本

分析维度：
- 内容完整性（权重20%）：基本信息、教育背景、工作经历、技能等是否完整
- 表达清晰度（权重25%）：语言是否简洁清晰，逻辑是否通顺
- 量化成果（权重25%）：是否有具体数据支撑，成果是否可量化
- 关键词匹配（权重15%）：与目标岗位的关键技术/技能匹配度
- 格式规范（权重15%）：排版、格式是否规范专业

请严格按照指定的JSON格式输出，确保JSON格式正确可解析。
```

#### 用户 Prompt 模板

```
请分析以下简历内容：

目标岗位：{targetPosition}

简历内容：
---
{resumeContent}
---

请按照以下JSON格式输出分析结果：
{
  "overallScore": <1-100的整数>,
  "scoreLevel": "<优秀/良好/及格/需改进>",
  "dimensions": [
    {
      "name": "内容完整性",
      "key": "completeness",
      "score": <0-100>,
      "weight": 20,
      "comment": "<评价说明>"
    },
    // ...其他4个维度
  ],
  "problems": [
    {
      "id": "p001",
      "type": "<critical/major/minor>",
      "title": "<问题标题>",
      "description": "<详细描述>",
      "location": "<问题位置>",
      "suggestion": "<改进建议>"
    }
  ],
  "suggestions": [
    {
      "id": "s001",
      "category": "<类别如工作经历/技能描述>",
      "priority": "<high/medium/low>",
      "original": "<原文内容>",
      "optimized": "<优化后内容>",
      "reason": "<优化理由>"
    }
  ],
  "optimizedContent": "<完整的优化后简历文本>"
}
```

### 5.3 LLM 调用流程

```
1. 接收分析请求
       │
       ▼
2. 组装Prompt（系统Prompt + 用户Prompt + 简历内容）
       │
       ▼
3. 调用LLM API
       │
       ├─── 成功 → 解析JSON响应 → 存储结果
       │
       └─── 失败 → 重试（最多3次）
                    │
                    ├─── 重试成功 → 继续流程
                    │
                    └─── 重试失败 → 切换备用服务商
                                     │
                                     └─── 仍失败 → 标记任务失败
```

### 5.4 服务降级策略

| 场景             | 策略                           |
| ---------------- | ------------------------------ |
| OpenAI 超时      | 切换到 DeepSeek                |
| 所有服务商不可用 | 返回错误，建议稍后重试         |
| Token 超限       | 截断简历内容，保留核心部分     |
| 响应格式错误     | 重试一次，仍失败则人工处理标记 |

---

## 6. 文件处理模块

### 6.1 上传流程

```
1. 前端上传文件
       │
       ▼
2. Multer中间件接收
   - 文件大小校验（≤10MB）
   - 文件类型校验（仅PDF）
       │
       ▼
3. 存储临时文件
   - 路径: /tmp/uploads/{uuid}.pdf
       │
       ▼
4. PDF文本提取
   - 使用pdf-parse库
   - 提取全文内容
       │
       ▼
5. 生成文件记录
   - 存入数据库
   - 返回fileId
       │
       ▼
6. 清理临时文件（异步）
```

### 6.2 PDF 解析策略

| 场景       | 处理方式                     |
| ---------- | ---------------------------- |
| 正常 PDF   | 直接使用 pdf-parse 提取      |
| 扫描件 PDF | 返回提示，建议手动输入       |
| 加密 PDF   | 返回错误，要求上传无密码版本 |
| 损坏 PDF   | 返回错误，建议重新上传       |

### 6.3 PDF 生成规范

使用 PDFKit 生成导出文件：

**页面规格**

- 尺寸: A4 (595.28 x 841.89 pt)
- 页边距: 上下 50pt，左右 60pt
- 主标题: 18pt, 加粗
- 副标题: 14pt, 加粗
- 正文: 11pt
- 行高: 1.5 倍

---

## 7. 错误处理规范

### 7.1 统一响应格式

**成功响应**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... }
}
```

**错误响应**

```json
{
  "code": 400,
  "message": "请求参数错误",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": [{ "field": "email", "message": "邮箱格式不正确" }]
  }
}
```

### 7.2 错误码定义

| code | type                | 描述                        |
| ---- | ------------------- | --------------------------- |
| 400  | VALIDATION_ERROR    | 请求参数校验失败            |
| 401  | UNAUTHORIZED        | 未登录或 Token 失效         |
| 403  | FORBIDDEN           | 无权限访问                  |
| 404  | NOT_FOUND           | 资源不存在                  |
| 413  | FILE_TOO_LARGE      | 文件过大                    |
| 415  | UNSUPPORTED_FORMAT  | 不支持的文件格式            |
| 422  | PROCESSING_ERROR    | 处理失败（如 PDF 解析）     |
| 429  | RATE_LIMITED        | 请求过于频繁                |
| 500  | INTERNAL_ERROR      | 服务器内部错误              |
| 503  | SERVICE_UNAVAILABLE | 服务暂不可用（如 LLM 服务） |

### 7.3 日志规范

**日志级别**

- ERROR: 错误日志，需要关注
- WARN: 警告日志，潜在问题
- INFO: 重要业务日志
- DEBUG: 调试日志（生产环境关闭）

**日志格式**

```
[时间] [级别] [请求ID] [模块] 消息内容 {附加数据}
```

**示例**

```
[2024-12-26 10:30:00] [INFO] [req-abc123] [AnalysisService] 分析任务开始 {"analysisId": "analysis_xyz", "fileId": "file_abc"}
[2024-12-26 10:30:25] [ERROR] [req-abc123] [LLMService] OpenAI调用失败 {"error": "timeout", "model": "gpt-4"}
```

---

## 8. 安全设计

### 8.1 认证授权

| 方案         | 实现              |
| ------------ | ----------------- |
| 认证方式     | JWT Token         |
| Token 有效期 | 7 天              |
| 刷新机制     | 临近过期自动刷新  |
| 密码加密     | bcrypt, rounds=10 |

### 8.2 接口安全

| 安全措施     | 实现                  |
| ------------ | --------------------- |
| 限流         | 100 请求/分钟/IP      |
| 文件校验     | 类型白名单 + 大小限制 |
| 输入校验     | Joi Schema 验证       |
| SQL 注入防护 | 参数化查询            |
| XSS 防护     | 输出转义              |
| CORS         | 白名单域名            |
| HTTPS        | 强制 HTTPS            |
| Helmet       | 安全 HTTP 头          |

### 8.3 数据安全

| 措施     | 说明                      |
| -------- | ------------------------- |
| 传输加密 | 全站 HTTPS                |
| 存储加密 | 敏感字段加密存储          |
| 定期清理 | 临时文件/过期数据自动清理 |
| 隐私保护 | 简历内容 30 天后自动删除  |

---

## 9. 部署运维

### 9.1 环境配置

#### 开发环境

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/resume_dev
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-xxx
```

#### 生产环境

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@db-host:5432/resume_prod
REDIS_URL=redis://redis-host:6379
OPENAI_API_KEY=sk-xxx (从Secret Manager获取)
```

### 9.2 部署架构

```
                    ┌─────────────────┐
                    │   Nginx/CDN     │
                    │  (负载均衡/SSL) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Node App 1   │  │  Node App 2   │  │  Node App 3   │
│  (API Server) │  │  (API Server) │  │  (API Server) │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │ PostgreSQL  │          │    Redis    │
       │  (主从复制) │          │  (Cluster)  │
       └─────────────┘          └─────────────┘
```

### 9.3 容器化配置

**服务组成**
| 服务 | 端口 | 说明 |
|------|------|------|
| api | 3000 | 主应用服务 |
| worker | - | 队列任务处理 |
| postgres | 5432 | 数据库 |
| redis | 6379 | 缓存/队列 |

### 9.4 监控告警

| 监控项         | 阈值      | 告警方式   |
| -------------- | --------- | ---------- |
| API 响应时间   | >3 秒     | 邮件/Slack |
| 错误率         | >1%       | 邮件/Slack |
| CPU 使用率     | >80%      | 邮件       |
| 内存使用率     | >80%      | 邮件       |
| 队列积压       | >100 任务 | 邮件       |
| LLM 调用失败率 | >5%       | 邮件/短信  |

### 9.5 扩容策略

| 场景         | 策略             |
| ------------ | ---------------- |
| API 请求增加 | 水平扩展 API Pod |
| 队列积压     | 增加 Worker 实例 |
| 数据库压力   | 增加只读副本     |
| Redis 压力   | 扩展 Redis 集群  |

---

## 附录

### A. 环境变量完整列表

| 变量名           | 必填 | 描述                  | 示例             |
| ---------------- | ---- | --------------------- | ---------------- |
| NODE_ENV         | 是   | 运行环境              | production       |
| PORT             | 是   | 服务端口              | 3000             |
| DATABASE_URL     | 是   | 数据库连接            | postgresql://... |
| REDIS_URL        | 是   | Redis 连接            | redis://...      |
| OPENAI_API_KEY   | 是   | OpenAI 密钥           | sk-xxx           |
| DEEPSEEK_API_KEY | 否   | DeepSeek 密钥（备用） | sk-xxx           |
| JWT_SECRET       | 是   | JWT 签名密钥          | xxx              |
| UPLOAD_MAX_SIZE  | 否   | 上传大小限制          | 10485760         |
| LOG_LEVEL        | 否   | 日志级别              | info             |

### B. 依赖版本参考

```json
{
  "express": "^4.18.2",
  "typescript": "^5.3.0",
  "pg": "^8.11.0",
  "redis": "^4.6.0",
  "bull": "^4.12.0",
  "pdf-parse": "^1.1.1",
  "pdfkit": "^0.14.0",
  "openai": "^4.20.0",
  "multer": "^1.4.5-lts.1",
  "joi": "^17.11.0",
  "winston": "^3.11.0",
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "uuid": "^9.0.0"
}
```

---

**文档变更记录**

| 版本 | 日期       | 作者       | 变更内容 |
| ---- | ---------- | ---------- | -------- |
| v1.0 | 2024-12-26 | 后端架构组 | 初始版本 |
