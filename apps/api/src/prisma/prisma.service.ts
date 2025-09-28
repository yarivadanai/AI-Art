import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client: PrismaClient | null = null;

  constructor() {
    const provider = process.env.PRISMA_PROVIDER;
    const url = process.env.DATABASE_URL;

    if (provider && url) {
      this.logger.log(`Prisma enabled using provider ${provider}.`);
      try {
        this.client = new PrismaClient();
      } catch (error) {
        this.logger.warn(
          'Prisma client failed to initialize; reverting to in-memory persistence.',
          error,
        );
        this.client = null;
      }
    } else {
      this.logger.warn(
        'DATABASE_URL or PRISMA_PROVIDER missing; Prisma persistence disabled (in-memory fallback active).',
      );
    }
  }

  get isEnabled(): boolean {
    return this.client !== null;
  }

  get prisma(): PrismaClient {
    if (!this.client) {
      throw new Error('Prisma client is not initialised.');
    }
    return this.client;
  }

  async onModuleInit() {
    if (!this.client) {
      return;
    }
    try {
      await this.client.$connect();
      this.logger.log('Prisma connected successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to connect to Prisma datasource. Falling back to in-memory store.',
        error,
      );
      await this.client
        .$disconnect()
        .catch((disconnectError: unknown) =>
          this.logger.error(
            'Failed to disconnect prisma client after connection error',
            disconnectError,
          ),
        );
      this.client = null;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    if (!this.client) {
      return;
    }
    this.client.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    if (!this.client) {
      return;
    }
    await this.client.$disconnect();
  }
}
