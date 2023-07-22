import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { UserModule } from '~/users/user.module';
import { DeleteUserService } from './delete-user.service';

describe('(e2e) deleteUserService() ', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;

  let deleteUserService: DeleteUserService;

  const deleteUserDTO = {
    userId: '',
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    deleteUserService = moduleRef.get(DeleteUserService);

    await db.clearDatabase();

    const user = await db.user.create({
      data: {
        name: 'John Doe',
        searchableName: 'john doe',
        email: 'johndoe@email.com',
        document: '123.456.789-10',
        favoriteColor: allowedColors.BLUE,
        observations: 'Some observations',
      },
    });

    deleteUserDTO.userId = user.id;
  });

  it('should delete user', async () => {
    await deleteUserService.execute(deleteUserDTO);

    const deletedUser = await db.user.findUnique({
      where: {
        id: deleteUserDTO.userId,
      },
    });

    expect(deletedUser).toBeFalsy();
  });

  it('should throw if user does not exists', async () => {
    const invalidId = randomUUID();

    try {
      await deleteUserService.execute({ userId: invalidId });
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Usuário não encontrado');
    }
  });
});
