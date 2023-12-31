import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatedResponse } from '~/common/interfaces/paginated-response.interface';
import { PaginateService } from '~/common/services/paginate.service';
import { DatabaseService } from '~/database/services/database.service';
import { ListUsersQueryDTO } from '~/users/dtos/list-users-query.dto';
import { UserEntity } from '../user.entity';

type ListUsersServiceData = ListUsersQueryDTO;

@Injectable()
export class ListUsersService {
  constructor(
    private readonly db: DatabaseService,
    private readonly paginateService: PaginateService,
  ) {}

  async execute({ page = 1, pageLength = 10 }: ListUsersServiceData) {
    /**
     * Generate pagination args and response body
     */
    const { args, response } = this.paginateService.execute<
      PaginatedResponse<Omit<User, 'password' | 'refreshToken'>[]>,
      Prisma.UserFindManyArgs
    >({
      pageLength,
      page,
    });

    /**
     * Get users and total count
     */
    const [users, total] = await this.db.$transaction([
      this.db.user.findMany(args),
      this.db.user.count(),
    ]);

    /**
     * Set response data
     */
    response.data = users.map((user) => new UserEntity(user));

    response.total = total;

    return response;
  }
}
