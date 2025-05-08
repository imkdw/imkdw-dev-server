import { Member } from '@/member/domain/member/member';
import { MemberRepository } from '@/member/domain/member/member.repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async save(member: Member): Promise<Member> {
    const createdMember = await this.prisma.tx.member.create({ data: member });

    return Member.from(createdMember);
  }

  async findByEmailAndOAuthProvider(email: string, oAuthProvider: string): Promise<Member | null> {
    const member = await this.prisma.tx.member.findFirst({
      where: {
        email,
        oAuthProvider,
        deletedAt: null,
      },
    });

    return member ? Member.from(member) : null;
  }

  async findById(id: string): Promise<Member | null> {
    const member = await this.prisma.tx.member.findUnique({
      where: { id, deletedAt: null },
    });

    return member ? Member.from(member) : null;
  }
}
