import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '~/app.module';
import { waitForCondition } from '~/common/utils/wait-for-condition.util';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { CreateUserDTO } from '../dtos/create-user-dto';

describe('(POST) /users', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;
  let currTestId = 1;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  const customBeforeEach = async (testId: number) => {
    await waitForCondition(() => currTestId === testId);

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

    const { status, body } = await supertest(app.getHttpServer())
      .post('/users')
      .send(createUserDTO as CreateUserDTO);

    expect(status).toBe(201);

    expect(body.id).toBeTruthy();
    expect(body.name).toBe(createUserDTO.name);
    expect(body.searchableName).toBeTruthy();
    expect(body.email).toBe(createUserDTO.email);
    expect(body.document).toBe(createUserDTO.document);
    expect(body.favoriteColor).toBe(createUserDTO.favoriteColor);
    expect(body.observations).toBe(createUserDTO.observations);
  });

  it('should throw on duplicate email (case insensitive)', async () => {
    await customBeforeEach(2);

    await db.user.create({
      data: {
        name: 'Jane Doe',
        document: '987.654.321-09',
        email: createUserDTO.email,
        favoriteColor: allowedColors.RED,
        observations: 'Some observations',
      },
    });

    const { status, body } = await supertest(app.getHttpServer())
      .post('/users')
      .send(createUserDTO);

    expect(status).toBe(400);

    expect(body.message).toBe(
      'Já existe um usuário cadastrado com este e-mail',
    );
  });

  it('should throw on duplicate document', async () => {
    await customBeforeEach(3);

    await db.user.create({
      data: {
        name: 'Jane Doe',
        document: createUserDTO.document,
        email: 'janedoe@email.com',
        favoriteColor: allowedColors.RED,
        observations: 'Some observations',
      },
    });

    const { status, body } = await supertest(app.getHttpServer())
      .post('/users')
      .send(createUserDTO);

    expect(status).toBe(400);
    expect(body.message).toBe('Já existe um usuário cadastrado com este CPF');
  });

  it('should throw on invalid color', async () => {
    await customBeforeEach(4);

    const { status, body } = await supertest(app.getHttpServer())
      .post('/users')
      .send({ ...createUserDTO, favoriteColor: '#000000' } as CreateUserDTO);

    expect(status).toBe(400);
    expect(body.message).toBe(
      'A sua cor favorita deve ser uma das cores do arco-íris',
    );
  });
});
