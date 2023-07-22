import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { UserModule } from '~/users/user.module';
import { GetUserService } from './get-user.service';

describe('(e2e) getUserService() ', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;

  let getUserService: GetUserService;

  const getUserDTO = {
    userId: '',
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    getUserService = moduleRef.get(GetUserService);

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

    getUserDTO.userId = user.id;
  });

  it('should get user', async () => {
    const user = await getUserService.execute(getUserDTO);

    expect(user.id).toBe(getUserDTO.userId);
    expect(user.name).toBeTruthy();
    expect(user.email).toBeTruthy();
  });

  it('should throw if user does not exists', async () => {
    const invalidId = randomUUID();

    try {
      await getUserService.execute({ userId: invalidId });
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe('Usuário não encontrado');
    }
  });
});
