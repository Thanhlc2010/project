export const environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/api_test_db',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-key-here',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'
} as const;