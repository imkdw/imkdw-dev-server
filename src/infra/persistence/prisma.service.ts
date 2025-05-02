import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private RETRY_COUNT = 0;
  private MAX_RETIRES = 5;
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({ log: ['error'] });
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(): Promise<void> {
    try {
      await this.$connect();
      this.RETRY_COUNT = 0;
      this.$on('error' as never, async () => await this.reconnect());
    } catch (error) {
      if (this.RETRY_COUNT < this.MAX_RETIRES) {
        this.RETRY_COUNT++;
        const delay = Math.min(1000 * Math.pow(2, this.RETRY_COUNT - 1), 16000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.connectWithRetry();
      } else {
        throw error;
      }
    }
  }

  private async reconnect(): Promise<void> {
    try {
      await this.$disconnect();
      await this.connectWithRetry();
    } catch (error) {
      this.logger.error('Reconnect failed', error);
    }
  }
}
