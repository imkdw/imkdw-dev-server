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

  async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let attempts = 0;

    while (attempts < this.maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempts++;

        if (attempts === this.maxRetries) {
          throw error;
        }

        const delay = Math.min(1000 * Math.pow(2, attempts - 1), 16000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Failed to execute operation after max retries');
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
      console.log('재연결 실패', error);
    }
  }
}
