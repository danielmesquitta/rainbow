import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteUserParamsDTO {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
