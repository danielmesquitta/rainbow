import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { HashService } from '~/auth/services/hash.service';
import { toSearchable } from '~/common/utils/to-searchable.util';

export async function createAdminSeed(
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  hashService: HashService,
) {
  const name = 'Administrador';

  const encryptedPassword = await hashService.execute({
    text: process.env.ADMIN_PASSWORD,
  });

  await db.user.create({
    data: {
      name,
      document: '000.000.000-00',
      favoriteColor: '#000000',
      searchableName: toSearchable(name),
      email: process.env.ADMIN_EMAIL,
      password: encryptedPassword,
    },
  });
}
