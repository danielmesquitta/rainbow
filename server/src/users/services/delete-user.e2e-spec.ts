import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import * as supertest from 'supertest';
import { AppModule } from '~/app.module';
import { LoginService } from '~/auth/services/login.service';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';

describe('(DELETE) /users/:userId', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;
  let loginService: LoginService;
  let accessToken: string;

  const deleteUserDTO = {
    userId: '',
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    loginService = moduleRef.get(LoginService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await db.clearDatabase();

    await db.runSeeds();

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

    const tokens = await loginService.execute({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    accessToken = tokens.accessToken.token;
  });

  it('should delete user', async () => {
    const { status } = await supertest(app.getHttpServer())
      .delete(`/users/${deleteUserDTO.userId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(200);

    const deletedUser = await db.user.findUnique({
      where: {
        id: deleteUserDTO.userId,
      },
    });

    expect(deletedUser).toBeFalsy();
  });

  it('should reject if unauthorized', async () => {
    const { status } = await supertest(app.getHttpServer()).delete(
      `/users/${deleteUserDTO.userId}`,
    );

    expect(status).toBe(401);
  });

  it('should throw if user does not exists', async () => {
    const invalidId = randomUUID();

    const { status, body } = await supertest(app.getHttpServer())
      .delete(`/users/${invalidId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(404);

    expect(body.message).toBe('Usuário não encontrado');
  });
});
