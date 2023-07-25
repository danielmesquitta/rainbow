import { HashService } from '~/auth/services/hash.service';
import { createAdminSeed } from '~/database/services/create-admin-seed.service';
import { prisma } from './prisma';

const runSeeds = async () => {
  const hashService = new HashService();

  await createAdminSeed(prisma, hashService);
};

runSeeds();
