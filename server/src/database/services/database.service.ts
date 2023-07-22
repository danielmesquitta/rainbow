import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async clearDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    await this.$transaction([this.user.deleteMany()]);
  }
}
