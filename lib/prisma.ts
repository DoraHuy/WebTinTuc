// Prisma client import must match generator output in prisma/schema.prisma
// generator client { output = "../lib/generated/prisma" }
import { PrismaClient } from '@/lib/generated/prisma';

export const prisma = new PrismaClient();
