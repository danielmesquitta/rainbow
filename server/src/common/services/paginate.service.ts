import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '~/common/interfaces/paginated-response.interface';
import { DatabaseService } from '~/database/services/database.service';

type PaginateServiceData<
  ResponseType = PaginatedResponse,
  ArgsType = Record<string, any>,
> = {
  page?: number;
  pageLength: number;
  args?: ArgsType;
  response?: ResponseType;
};

@Injectable()
export class PaginateService {
  constructor(private readonly db: DatabaseService) {}

  execute<ResponseType = PaginatedResponse, ArgsType = Record<string, any>>({
    page,
    pageLength,
    args = {} as ArgsType,
    response = {} as ResponseType,
  }: PaginateServiceData<ResponseType, ArgsType>) {
    const localArgs = { ...args } as Record<string, any>;

    const localResponse = { ...response } as PaginatedResponse;

    if (page) {
      localArgs.skip = (page - 1) * pageLength;

      localArgs.take = pageLength;

      localResponse.page = page;

      localResponse.pageLength = pageLength;
    }

    return {
      response: localResponse as ResponseType,
      args: localArgs as ArgsType,
    };
  }
}
