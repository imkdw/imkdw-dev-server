import { Injectable } from '@nestjs/common';
import { CreateMemoUseCase } from './port/in/create-memo/create-memo.usecase';

@Injectable()
export class CreateMemoService implements CreateMemoUseCase {
  constructor() {}
}
