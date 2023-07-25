import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '~/app.module';
import { LoginService } from '~/auth/services/login.service';
import { waitForCondition } from '~/common/utils/wait-for-condition.util';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';

describe('(PUT) /users/:userId', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;
  let accessToken: string;
  let currTestId = 1;
  let userId = '';

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

  afterEach(() => {
    currTestId++;
  });

  const customBeforeEach = async (testId: number) => {
    await waitForCondition(() => currTestId === testId);

    await db.resetDatabase();

    const loginService = moduleRef.get(LoginService);

    const tokens = await loginService.execute({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    accessToken = tokens.accessToken.token;

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
    name: 'Jane Doe',
    document: '987.654.321-09',
    email: 'janedoe@email.com',
    favoriteColor: allowedColors.RED,
    observations: 'Updated observations',
  } as const;

  it('should update user', async () => {
    await customBeforeEach(1);

    const { status, body } = await supertest(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateUserDTO)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(200);

    expect(body.id).toBe(userId);
    expect(body.name).toBe(updateUserDTO.name);
    expect(body.searchableName).toBeTruthy();
    expect(body.email).toBe(updateUserDTO.email);
    expect(body.document).toBe(updateUserDTO.document);
    expect(body.favoriteColor).toBe(updateUserDTO.favoriteColor);
    expect(body.observations).toBe(updateUserDTO.observations);
  });

  it('should reject if unauthorized', async () => {
    await customBeforeEach(2);

    const { status } = await supertest(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateUserDTO);

    expect(status).toBe(401);
  });

  it('should throw on duplicate email (case insensitive)', async () => {
    await customBeforeEach(3);

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

    const { status, body } = await supertest(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateUserDTO)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(400);
    expect(body.message).toBe(
      'Já existe um usuário cadastrado com este e-mail',
    );
  });

  it('should throw on duplicate document', async () => {
    await customBeforeEach(4);

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

    const { status, body } = await supertest(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateUserDTO)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(400);
    expect(body.message).toBe('Já existe um usuário cadastrado com este CPF');
  });

  it('should throw on invalid color', async () => {
    await customBeforeEach(5);

    const { status, body } = await supertest(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({ ...updateUserDTO, favoriteColor: '#000000' })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(400);
    expect(body.message).toBe(
      'A sua cor favorita deve ser uma das cores do arco-íris',
    );
  });

  it('should throw if user does not exists', async () => {
    await customBeforeEach(6);

    await db.user.delete({
      where: {
        id: userId,
      },
    });

    const { status, body } = await supertest(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateUserDTO)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(404);
    expect(body.message).toBe('Usuário não encontrado');
  });
});
