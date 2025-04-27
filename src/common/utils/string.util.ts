import { v7 } from 'uuid';

export function generateUUID() {
  return v7();
}

export function slugify(text: string): string {
  const slug = text
    .toLowerCase() // 영어를 모두 소문자로 변경
    .trim() // 앞뒤 공백 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
    .replace(/[^\w\-]+/g, '-') // 영문자, 숫자, 하이픈 이외의 문자를 하이픈으로 변환
    .replace(/\-\-+/g, '-') // 연속된 하이픈을 단일 하이픈으로 변환
    .replace(/^-+/, '') // 시작 부분의 하이픈 제거
    .replace(/-+$/, ''); // 끝 부분의 하이픈 제거

  if (slug.length === 0) {
    return slug;
  }

  return `${slug}-${generateUUID().slice(-4)}`; // 임의의 4자리 문자열 추가
}
