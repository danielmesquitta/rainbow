import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserParamsDTO {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
