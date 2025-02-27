import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis; // Prevent multiple instances in dev mode

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
