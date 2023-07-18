import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQueryDTO {
  @ApiPropertyOptional({
    example: 1,
    type: Number,
    description: 'The page number to fetch',
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    type: Number,
    description: 'The number of items per page',
  })
  @IsOptional()
  pageLength?: number;
}
