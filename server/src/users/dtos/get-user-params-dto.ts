import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserParamsDTO {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
