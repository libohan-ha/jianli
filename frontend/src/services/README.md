# 服务层 (Services)

负责与后端及其它外部服务进行交互的逻辑封装。

## Service 列表

- **api.ts**: Axios 实例的封装，配置了全局的请求拦截器和响应拦截器，处理统一的错误提示。
- **uploadService.ts**: 封装文件上传相关的 API 请求及文件格式验证逻辑。
- **analysisService.ts**: 封装简历分析相关的 API 请求（如启动分析、查询进度、获取结果）以及轮询进度的 helper 函数。
