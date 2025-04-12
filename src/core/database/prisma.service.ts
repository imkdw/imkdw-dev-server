import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private retryCount = 0;
  private maxRetries = 5;

  constructor() {
    super({ log: ['error'] });
  }

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(): Promise<void> {
    try {
      await this.$connect();
      this.retryCount = 0;
      this.$on('error' as never, async () => await this.reconnect());
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 16000);
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
      console.log('Reconnect failed', error);
    }
  }
}
