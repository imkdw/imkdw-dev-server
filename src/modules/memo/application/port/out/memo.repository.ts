import { Memo } from '../../../domain/memo/memo';

export interface MemoRepository {
  save(memo: Memo): Promise<Memo>;
  findById(id: string): Promise<Memo>;
}
