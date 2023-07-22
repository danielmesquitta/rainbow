import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

export interface HashServiceData {
  text: string;
  saltOrRounds?: string | number;
}

@Injectable()
export class HashService {
  async execute({ text, saltOrRounds = 12 }: HashServiceData) {
    return hash(text, saltOrRounds);
  }
}
