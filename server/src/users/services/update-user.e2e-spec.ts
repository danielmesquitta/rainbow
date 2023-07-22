import { Test, TestingModule } from '@nestjs/testing';
import { wait } from '~/common/utils/wait';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { UpdateUserService } from '~/users/services/update-user.service';
import { UserModule } from '~/users/user.module';

describe('(e2e) updateUserService() ', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let currTestId = 1;
  let userId = '';

  let updateUserService: UpdateUserService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    updateUserService = moduleRef.get(UpdateUserService);
  });

  afterEach(() => {
    currTestId++;
  });

  const customBeforeEach = async (testId: number) => {
    while (currTestId !== testId) {
      await wait(10);
    }

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

    userId = user.id;
  };

  const updateUserDTO = {
    userId: '',
    name: 'Jane Doe',
    document: '987.654.321-09',
    email: 'janedoe@email.com',
    favoriteColor: allowedColors.RED,
    observations: 'Updated observations',
  };

  it('should update user', async () => {
    await customBeforeEach(1);

    updateUserDTO.userId = userId;

    const updatedUser = await updateUserService.execute(updateUserDTO);

    expect(updatedUser.id).toBe(userId);
    expect(updatedUser.name).toBe(updateUserDTO.name);
    expect(updatedUser.searchableName).toBeTruthy();
    expect(updatedUser.email).toBe(updateUserDTO.email);
    expect(updatedUser.document).toBe(updateUserDTO.document);
    expect(updatedUser.favoriteColor).toBe(updateUserDTO.favoriteColor);
    expect(updatedUser.observations).toBe(updateUserDTO.observations);
  });

  it('should throw on duplicate email (case insensitive)', async () => {
    await customBeforeEach(2);

    updateUserDTO.userId = userId;

    await db.user.create({
      data: {
        name: 'Jane Doe II',
        searchableName: 'jane doe',
        email: 'janedoe@email.com',
        document: '456.789.123-10',
        favoriteColor: allowedColors.RED,
        observations: 'Some observations',
      },
    });

    try {
      await updateUserService.execute(updateUserDTO);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'Já existe um usuário cadastrado com este e-mail',
      );
    }
  });

  it('should throw on duplicate document', async () => {
    await customBeforeEach(3);

    updateUserDTO.userId = userId;

    await db.user.create({
      data: {
        name: 'Jane Doe II',
        searchableName: 'jane doe',
        email: 'janedoeII@email.com',
        document: '987.654.321-09',
        favoriteColor: allowedColors.RED,
        observations: 'Some observations',
      },
    });

    try {
      await updateUserService.execute({
        userId,
        ...updateUserDTO,
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'Já existe um usuário cadastrado com este CPF',
      );
    }
  });

  it('should throw on invalid color', async () => {
    await customBeforeEach(4);

    updateUserDTO.userId = userId;

    await updateUserService.execute({ userId, ...updateUserDTO });

    try {
      await updateUserService.execute({
        ...updateUserDTO,
        favoriteColor: 'invalid color',
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'A sua cor favorita deve ser uma das cores do arco-íris',
      );
    }
  });
});
