import type { AnalysisProgress, AnalysisResult } from '../types';

// 模拟分析结果
export const mockAnalysisResult: AnalysisResult = {
  overallScore: 78,
  dimensions: [
    { name: '内容完整性', score: 85, comment: '基本信息完整，但缺少GitHub链接' },
    { name: '表达清晰度', score: 75, comment: '部分描述不够简洁' },
    { name: '量化成果', score: 68, comment: '缺乏具体数据支撑' },
    { name: '关键词匹配', score: 70, comment: '技术关键词覆盖一般' },
    { name: '格式规范', score: 80, comment: '排版基本规范' },
  ],
  problems: [
    {
      id: 'p1',
      type: 'critical',
      description: '工作经历缺乏具体数据支撑，无法体现实际成果',
      location: '第二段工作经历',
    },
    {
      id: 'p2',
      type: 'major',
      description: '项目描述过于简单，缺乏STAR描述法',
      location: '项目经历模块',
    },
    {
      id: 'p3',
      type: 'suggestion',
      description: '可补充技术博客或开源项目链接',
      location: '个人信息模块',
    },
  ],
  suggestions: [
    {
      id: 's1',
      category: '工作经历',
      original: '负责公司官网的开发和维护',
      optimized: '主导公司官网重构项目，采用React技术栈，实现页面加载速度提升40%，日均PV增长25%',
      reason: '使用STAR描述法，添加量化成果',
    },
    {
      id: 's2',
      category: '技能描述',
      original: '熟悉前端开发',
      optimized: '精通React/Vue前端框架，熟练使用TypeScript，具备Webpack/Vite工程化配置经验',
      reason: '细化技能点，增加技术关键词',
    },
    {
      id: 's3',
      category: '项目经历',
      original: '开发了一个电商系统',
      optimized: '主导电商平台前端架构设计，实现商品列表虚拟滚动、购物车本地持久化等核心功能，支撑日均10万+UV访问',
      reason: '具体化项目职责和成果',
    },
  ],
  originalContent: `张三
前端开发工程师
电话: 138xxxx1234
邮箱: zhangsan@email.com

工作经历
2022-至今 XX公司 前端开发
负责公司官网的开发和维护

项目经历
开发了一个电商系统

技能
熟悉前端开发`,
  optimizedContent: `张三
高级前端开发工程师
电话: 138xxxx1234
邮箱: zhangsan@email.com
GitHub: github.com/zhangsan

工作经历
2022.03 - 至今 XX科技有限公司 前端技术负责人
• 主导公司官网重构项目，采用React技术栈，实现页面加载速度提升40%，日均PV增长25%
• 搭建前端CI/CD自动化部署流程，部署效率提升60%
• 制定前端代码规范，引入ESLint/Prettier，代码质量显著提升

项目经历
电商平台 | 前端负责人 | 2022.06 - 2023.02
• 主导电商平台前端架构设计，实现商品列表虚拟滚动、购物车本地持久化等核心功能
• 支撑日均10万+UV访问，页面性能评分达到90+
• 技术栈：React + TypeScript + Zustand + TailwindCSS

技能
• 精通React/Vue前端框架，熟练使用TypeScript
• 具备Webpack/Vite工程化配置经验
• 熟悉Node.js，有全栈开发经验`,
};

// 模拟分析进度步骤
export const mockProgressSteps = [
  { name: '文件解析完成', status: 'completed' as const },
  { name: '内容结构识别', status: 'completed' as const },
  { name: '技能关键词提取', status: 'processing' as const },
  { name: '岗位匹配分析', status: 'pending' as const },
  { name: '生成优化建议', status: 'pending' as const },
  { name: '完成分析报告', status: 'pending' as const },
];

// 模拟进度更新
export function simulateProgress(
  onProgress: (progress: AnalysisProgress) => void,
  onComplete: (result: AnalysisResult) => void
): () => void {
  let progress = 0;
  let stepIndex = 0;
  const steps = [...mockProgressSteps];

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // 完成所有步骤
      steps.forEach(step => step.status = 'completed');
      
      onProgress({
        status: 'completed',
        progress: 100,
        currentStep: '分析完成',
        steps,
      });

      setTimeout(() => {
        onComplete(mockAnalysisResult);
      }, 500);
      return;
    }

    // 更新当前步骤
    const newStepIndex = Math.floor((progress / 100) * steps.length);
    if (newStepIndex > stepIndex && newStepIndex < steps.length) {
      for (let i = 0; i <= stepIndex; i++) {
        steps[i].status = 'completed';
      }
      steps[newStepIndex].status = 'processing';
      stepIndex = newStepIndex;
    }

    const stepNames = [
      '正在解析文件...',
      '正在识别内容结构...',
      '正在提取技能关键词...',
      '正在进行岗位匹配分析...',
      '正在生成优化建议...',
      '正在完成分析报告...',
    ];

    onProgress({
      status: 'analyzing',
      progress: Math.round(progress),
      currentStep: stepNames[Math.min(stepIndex, stepNames.length - 1)],
      steps,
    });
  }, 800);

  return () => clearInterval(interval);
}