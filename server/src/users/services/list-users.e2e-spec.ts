import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { UserModule } from '~/users/user.module';
import { ListUsersService } from './list-users.service';

describe('(e2e) listUserService() ', () => {
  let db: DatabaseService;
  let moduleRef: TestingModule;

  let listUserService: ListUsersService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    db = moduleRef.get(DatabaseService);

    listUserService = moduleRef.get(ListUsersService);

    await db.clearDatabase();

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
  });

  it('should list users', async () => {
    const users = await listUserService.execute({});

    expect(users.data.length).toBe(2);
    expect(users.data[0].id).toBeTruthy();
  });

  it('should be able to paginate users listing', async () => {
    const users = await listUserService.execute({
      page: 1,
      pageLength: 1,
    });

    expect(users.data.length).toBe(1);
    expect(users.pageLength).toBe(1);
    expect(users.total).toBe(2);
  });
});
