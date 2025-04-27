import { slugify } from '@/common/utils/string.util';

describe('slugify', () => {
  it.each([
    ['Hello World', 'hello-world'],
    ['UPPERCASE TEXT', 'uppercase-text'],
    ['multiple   spaces', 'multiple-spaces'],
    ['special@#$%characters', 'special-characters'],
    ['  leading and trailing spaces  ', 'leading-and-trailing-spaces'],
    ['multiple!!!special&&chars', 'multiple-special-chars'],
    ['numbers123and456text', 'numbers123and456text'],
    ['--leading-hyphens', 'leading-hyphens'],
    ['trailing-hyphens--', 'trailing-hyphens'],
    ['product name (special edition)', 'product-name-special-edition'],
    ['email@example.com', 'email-example-com'],
  ])('"%s"를 슬러그로 변환하면 "%s-xxxx" 형태가 된다', (input, expectedBase) => {
    const result = slugify(input);
    const parts = result.split('-');
    const uuid4 = parts.pop();
    const baseSlug = parts.join('-');

    expect(result).toMatch(new RegExp(`^${expectedBase}-[a-f0-9]{4}$`));
    expect(baseSlug).toBe(expectedBase);
    expect(uuid4).toMatch(/^[a-f0-9]{4}$/);
  });

  describe('빈 문자열을 변환하면', () => {
    it('빈 문자열이 반환된다', () => {
      const result = slugify('');
      expect(result).toBe('');
    });
  });

  describe('전부 특수문자인 문자열을 변환하면', () => {
    it('빈 문자열이 반환된다', () => {
      const result = slugify('@#$%^&');
      expect(result).toBe('');
    });
  });
});
