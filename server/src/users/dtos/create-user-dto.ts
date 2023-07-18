import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'johndoe@email.com' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  email: string;

  @ApiProperty({ example: '123.456.789-01' })
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'O documento deve possuir o formato de CPF (XXX.XXX.XXX-XX)',
  })
  document: string;

  @ApiProperty({ example: '#ffffff' })
  @IsNotEmpty({ message: 'A cor favorita é obrigatória' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  favoriteColor: string;

  observations?: string;
}
