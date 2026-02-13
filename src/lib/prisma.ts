import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({ adapter });
  }

  // En desarrollo usamos el adapter también
  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
