import { PrismaClient } from "@prisma/client";

const globalPrisma = globalThis.prisma;

let prisma;

if (!globalPrisma) {
  prisma = new PrismaClient();
  if (process.env.NODE_ENV === "development") {
    globalThis.prisma = prisma;
  }
  else {
    globalThis.prisma = prisma;
  }
}

export default prisma;