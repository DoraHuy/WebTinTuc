import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  adapter: {
    provider: 'mysql',
    url: process.env.DATABASE_URL,
  }
});
