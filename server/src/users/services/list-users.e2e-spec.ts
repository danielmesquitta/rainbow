import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { AppModule } from '~/app.module';
import { LoginService } from '~/auth/services/login.service';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';

describe('(GET) /users', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;
  let accessToken: string;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    const loginService = moduleRef.get(LoginService);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    await db.clearDatabase();

    await db.runSeeds();

    await db.user.createMany({
      data: [
        {
          name: 'John Doe',
          searchableName: 'john doe',
          email: 'johndoe@email.com',
          document: '123.456.789-10',
          favoriteColor: allowedColors.BLUE,
          observations: 'Some observations',
        },
        {
          name: 'Jane Doe',
          searchableName: 'jane doe',
          email: 'janedoe@email.com',
          document: '987.654.321-09',
          favoriteColor: allowedColors.RED,
          observations: 'Some observations',
        },
      ],
    });

    const tokens = await loginService.execute({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    accessToken = tokens.accessToken.token;
  });

  it('should list users', async () => {
    const { status, body } = await supertest(app.getHttpServer())
      .get(`/users`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(200);
    expect(body.data[0].id).toBeTruthy();
  });

  it('should reject if unauthorized', async () => {
    const { status } = await supertest(app.getHttpServer()).get(`/users`);

    expect(status).toBe(401);
  });

  it('should be able to paginate users listing', async () => {
    const { status, body } = await supertest(app.getHttpServer())
      .get(`/users?page=1&pageLength=1`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(status).toBe(200);
    expect(body.data.length).toBe(1);
    expect(body.pageLength).toBe(1);
    expect(body.total).toBe(3);
  });
});
