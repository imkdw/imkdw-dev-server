export class MemoName {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  replaceImageUrls(existImageUrls: string[], newImageNames: string[]): string {}
}
