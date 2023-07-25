import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import * as supertest from 'supertest';
import { AppModule } from '~/app.module';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';

describe('(POST) /auth/login', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;

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

    await db.resetDatabase();
  });

  it('should login', async () => {
    const { status, body } = await supertest(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });

    expect(status).toBe(201);

    expect(body.accessToken?.token).toBeTruthy();
    expect(body.refreshToken?.token).toBeTruthy();
    expect(body.user?.id).toBeTruthy();
    expect(body.user?.password).toBeFalsy();
  });

  it('should throw if user does not exists', async () => {
    const invalidEmail = 'invalid-email@email.com';

    const { status, body } = await supertest(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        email: invalidEmail,
        password: process.env.ADMIN_PASSWORD,
      });

    expect(status).toBe(401);

    expect(body.message).toBe('E-mail ou senha incorretos');
  });

  it('should throw if password is invalid', async () => {
    const invalidPassword = randomUUID();

    const { status, body } = await supertest(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        email: process.env.ADMIN_EMAIL,
        password: invalidPassword,
      });

    expect(status).toBe(401);

    expect(body.message).toBe('E-mail ou senha incorretos');
  });

  it('should throw if password is not registered', async () => {
    const invalidPassword = randomUUID();

    const user = await db.user.create({
      data: {
        name: 'John Doe',
        searchableName: 'john doe',
        email: 'johndoe@email.com',
        document: '123.456.789-10',
        favoriteColor: allowedColors.BLUE,
      },
    });

    const { status, body } = await supertest(app.getHttpServer())
      .post(`/auth/login`)
      .send({
        email: user.email,
        password: invalidPassword,
      });

    expect(status).toBe(401);

    expect(body.message).toBe('Usuário não possui permissão');
  });
});
