import { HashService } from '~/auth/services/hash.service';
import { toSearchable } from '~/common/utils/to-searchable.util';
import { prisma } from './prisma';

const hashService = new HashService();

export async function createAdminUser() {
  const name = 'Administrador';

  const encryptedPassword = await hashService.execute({
    text: process.env.ADMIN_PASSWORD,
  });

  await prisma.user.create({
    data: {
      name,
      document: '00000000000',
      favoriteColor: '#000000',
      searchableName: toSearchable(name),
      email: process.env.ADMIN_EMAIL,
      password: encryptedPassword,
    },
  });
}
