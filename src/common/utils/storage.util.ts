import { generateUUID } from '@/common/utils/string.util';

export interface GeneratePathParams {
  id: string;
  prefix: string;
}

export function generateStoragePath(params: GeneratePathParams[], extension: string): string {
  const path = params.reduce((acc, param) => `${acc}/${param.prefix}/${param.id}`, '').slice(1);

  return `${path}/${generateUUID()}.${extension}`.replaceAll('//', '/');
}
