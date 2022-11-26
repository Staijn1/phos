import { PrismaClient } from '@prisma/client'

/**
 * An interface to generalize some common database operations.
 */
export abstract class DatabaseConnection {
  protected client: PrismaClient

  connect(): void {
    this.client = new PrismaClient();
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}
