import { SetMetadata } from '@nestjs/common';
import { MemberRole } from 'src/modules/member/member.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);
