export class PaginatedResponse<T = any[]> {
  data: T;
  total?: number;
  page?: number;
  pageLength?: number;
}
