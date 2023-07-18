import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches } from 'class-validator';

export class UpdateUserDTO {
  @ApiPropertyOptional({ example: 'João da Silva' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'johndoe@email.com' })
  @IsOptional({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  email?: string;

  @ApiPropertyOptional({ example: '123.456.789-01' })
  @IsOptional({ message: 'O documento é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'O documento deve possuir o formato de CPF (XXX.XXX.XXX-XX)',
  })
  document?: string;

  @ApiPropertyOptional({ example: '#E81416' })
  @IsOptional({ message: 'A cor favorita é obrigatória' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  favoriteColor?: string;

  @ApiPropertyOptional({ example: 'Observações' })
  @IsOptional()
  observations?: string;
}
