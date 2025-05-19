import { InvalidMemoImageException } from '@/memo/domain/memo/exception/invalid-memo-image.exception';

export class MemoContent {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  replaceImageUrls(existImageUrls: string[], newImageNames: string[]): MemoContent {
    if (existImageUrls.length !== newImageNames.length) {
      throw new InvalidMemoImageException('이미지 개수가 일치하지 않습니다.');
    }

    let newValue = this.value;
    existImageUrls.forEach((url, index) => {
      newValue = newValue.replace(url, newImageNames[index]);
    });

    return new MemoContent(newValue);
  }
}
