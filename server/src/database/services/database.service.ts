import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HashService } from '~/auth/services/hash.service';
import { createAdminSeed } from './create-admin-seed.service';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async clearDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    await this.$transaction([this.user.deleteMany()]);
  }

  async runSeeds() {
    const hashService = new HashService();

    await createAdminSeed(this, hashService);
  }

  async resetDatabase() {
    await this.clearDatabase();

    await this.runSeeds();
  }
}
