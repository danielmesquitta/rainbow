import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '~/app.module';
import { waitForCondition } from '~/common/utils/wait-for-condition.util';
import { DatabaseService } from '~/database/services/database.service';
import { LoginService } from './login.service';

describe('(POST) /auth/logout', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;
  let accessToken: string;
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
  };

  it('should logout', async () => {
    await customBeforeEach(1);

    const { status } = await supertest(app.getHttpServer())
      .post(`/auth/logout`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(201);
  });

  it('should throw if unauthorized', async () => {
    await customBeforeEach(2);

    const { status } = await supertest(app.getHttpServer()).post(
      `/auth/logout`,
    );

    expect(status).toBe(401);
  });

  it('should throw if user does not exists', async () => {
    await customBeforeEach(3);

    await db.user.delete({
      where: {
        email: process.env.ADMIN_EMAIL,
      },
    });

    const { status, body } = await supertest(app.getHttpServer())
      .post(`/auth/logout`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(404);

    expect(body.message).toBe('Usuário não encontrado');
  });
});
