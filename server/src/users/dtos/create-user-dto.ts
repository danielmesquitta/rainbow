import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
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

  @ApiProperty({ example: '#E81416' })
  @IsNotEmpty({ message: 'A cor favorita é obrigatória' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'A cor favorita deve possuir formato hexadecimal',
  })
  favoriteColor: string;

  @ApiPropertyOptional({ example: 'Observações' })
  @IsOptional()
  observations?: string;
}
