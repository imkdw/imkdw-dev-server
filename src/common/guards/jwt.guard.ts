import { IS_PUBLIC_KEY } from '@/common/decorator/public.decorator';
import { parseJwtFromCookie } from '@/common/utils/authorization.util';
import { JwtService } from '@/infra/jwt/jwt.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const { accessToken } = parseJwtFromCookie(request.headers?.cookie ?? '');
    if (!accessToken) {
      return false;
    }

    try {
      const { id: memberId } = this.jwtService.verifyJwt(accessToken);
      if (!memberId) {
        return false;
      }

      const { id, role } = await this.prisma.tx.member.findUniqueOrThrow({ where: { id: memberId } });

      request.user = { ...request.user, id, role };

      return true;
    } catch {
      return false;
    }
  }
}
