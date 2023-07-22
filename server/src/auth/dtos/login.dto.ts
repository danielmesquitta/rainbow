import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty({ example: 'admin@email.com' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
