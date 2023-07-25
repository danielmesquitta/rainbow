import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDTO {
  @ApiPropertyOptional({
    example: 1,
    type: Number,
    description: 'The page number to fetch',
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    type: Number,
    description: 'The number of items per page',
  })
  @IsOptional()
  @IsNumber()
  pageLength?: number;
}
