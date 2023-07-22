import { Test, TestingModule } from '@nestjs/testing';
import { wait } from '~/common/utils/wait';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { CreateUserService } from '~/users/services/create-user.service';
import { UserModule } from '~/users/user.module';

describe('(e2e) createUserService() ', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let currTestId = 1;

  let createUserService: CreateUserService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    createUserService = moduleRef.get(CreateUserService);
  });

  const customBeforeEach = async (testId: number) => {
    while (currTestId !== testId) {
      await wait(10);
    }
    await db.clearDatabase();
  };

  afterEach(() => {
    currTestId++;
  });

  const createUserDTO = {
    name: 'John Doe',
    email: 'johndoe@email.com',
    document: '123.456.789-10',
    favoriteColor: allowedColors.BLUE,
    observations: 'Some observations',
  };

  it('should create user', async () => {
    await customBeforeEach(1);

    const user = await createUserService.execute(createUserDTO);

    expect(user.id).toBeTruthy();
    expect(user.name).toBe(createUserDTO.name);
    expect(user.searchableName).toBeTruthy();
    expect(user.email).toBe(createUserDTO.email);
    expect(user.document).toBe(createUserDTO.document);
    expect(user.favoriteColor).toBe(createUserDTO.favoriteColor);
    expect(user.observations).toBe(createUserDTO.observations);
  });

  it('should throw on duplicate email (case insensitive)', async () => {
    await customBeforeEach(2);

    await createUserService.execute(createUserDTO);

    try {
      await createUserService.execute({
        name: 'Jane Doe',
        document: '987.654.321-09',
        email: createUserDTO.email.toUpperCase(),
        favoriteColor: allowedColors.RED,
        observations: 'Some observations',
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'Já existe um usuário cadastrado com este e-mail',
      );
    }
  });

  it('should throw on duplicate document', async () => {
    await customBeforeEach(3);

    await createUserService.execute(createUserDTO);

    try {
      await createUserService.execute({
        name: 'Jane Doe',
        document: createUserDTO.document,
        email: 'janedoe@email.com',
        favoriteColor: allowedColors.RED,
        observations: 'Some observations',
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

    await createUserService.execute(createUserDTO);

    try {
      await createUserService.execute({
        name: 'Jane Doe',
        document: '987.654.321-09',
        email: 'janedoe@email.com',
        favoriteColor: 'invalid-color',
        observations: 'Some observations',
      });
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe(
        'A sua cor favorita deve ser uma das cores do arco-íris',
      );
    }
  });
});
