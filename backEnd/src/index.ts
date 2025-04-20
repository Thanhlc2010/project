import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import timeout from 'connect-timeout';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { environment } from './config/environment';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import issueRoutes from './routes/issueRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import { AppError } from './utils/AppError';
import { prisma } from './utils/prismaClient';
import pertRoutes from "./routes/pertRoutes";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: environment.NODE_ENV === 'production' ? 'your-production-domain' : true,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Request timeout
app.use(timeout('30s'));
app.use((req, res, next) => {
  if (!(req as any).timedout) next();
});

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Trust proxy
app.set('trust proxy', false);
// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// Routes
// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/perts', pertRoutes);
app.use('/api/issues', issueRoutes);

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'NOT_FOUND'));
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = environment.PORT;
let server: any;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('🗄️  Database connected successfully');

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${environment.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutDown = async () => {
  console.log('🔄 Received kill signal, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('🏁 Server closed');
      prisma
        .$disconnect()
        .then(() => {
          console.log('📝 Database connection closed');
          process.exit(0);
        })
        .catch(err => {
          console.error('Error during disconnection:', err);
          process.exit(1);
        });
    });

    // Force close after 10s
    setTimeout(() => {
      console.error('⚠️  Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM RECEIVED');
  await shutDown();
});

// Handle SIGINT
process.on('SIGINT', async () => {
  console.log('👋 SIGINT RECEIVED');
  await shutDown();
});

startServer();

export { app, prisma };
