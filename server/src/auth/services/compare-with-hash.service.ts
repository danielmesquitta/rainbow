import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

export interface CompareWithHashServiceData {
  hashedText: string;
  text: string;
}

@Injectable()
export class CompareWithHashService {
  async execute({ hashedText, text }: CompareWithHashServiceData) {
    return compare(text, hashedText);
  }
}
