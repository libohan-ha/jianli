import OpenAI from 'openai';
import { LLMAnalysisResponse } from '../types/analysis';

// DeepSeek API配置
const client = new OpenAI({
  apiKey: 'sk-916b2398ca2043cbb6ae8abe8e6ab69e',
  baseURL: 'https://api.deepseek.com',
});

// 系统提示词
const SYSTEM_PROMPT = `你是一位拥有10年招聘经验的资深HR，专注于互联网/科技行业人才招聘。

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

请严格按照指定的JSON格式输出，确保JSON格式正确可解析。`;

// 用户提示词模板
function buildUserPrompt(resumeContent: string, targetPosition: string): string {
  return `请分析以下简历内容：

目标岗位：${targetPosition}

简历内容：
---
${resumeContent}
---

请按照以下JSON格式输出分析结果（注意：只输出JSON，不要有其他内容）：
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
    {
      "name": "表达清晰度",
      "key": "clarity",
      "score": <0-100>,
      "weight": 25,
      "comment": "<评价说明>"
    },
    {
      "name": "量化成果",
      "key": "quantification",
      "score": <0-100>,
      "weight": 25,
      "comment": "<评价说明>"
    },
    {
      "name": "关键词匹配",
      "key": "keywords",
      "score": <0-100>,
      "weight": 15,
      "comment": "<评价说明>"
    },
    {
      "name": "格式规范",
      "key": "format",
      "score": <0-100>,
      "weight": 15,
      "comment": "<评价说明>"
    }
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
}`;
}

// 调用DeepSeek API分析简历
export async function analyzeResume(
  resumeContent: string,
  targetPosition: string
): Promise<LLMAnalysisResponse> {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(resumeContent, targetPosition) },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('LLM返回内容为空');
  }

  // 解析JSON
  try {
    // 尝试提取JSON（处理可能的markdown代码块）
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    const result = JSON.parse(jsonStr.trim()) as LLMAnalysisResponse;
    return result;
  } catch (err) {
    console.error('解析LLM响应失败:', content);
    throw new Error('解析AI响应失败');
  }
}