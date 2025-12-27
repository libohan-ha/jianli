import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import { ensureUploadDir } from './services/fileService';

const app = express();

// 确保上传目录存在
ensureUploadDir();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API路由
app.use('/api/v1', routes);

// 错误处理
app.use(errorHandler);

export default app;