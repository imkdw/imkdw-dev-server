import { MemoTitle } from '../../../../domain/value-object/memo-title.vo';

export default class CreateMemoCommand {
  constructor(
    private readonly title: MemoTitle,
    private readonly content: string,
  ) {}

  getTitle(): string {
    return this.title.toString();
  }

  getContent(): string {
    return this.content;
  }

  private validate() {}
}
