import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { RequestContextService } from "@/common/request-context/request-context.service";
import { LandingTokenDto, PagedResult } from "@myorg/shared/dto";
import { UpdateNoteLandingTokenDtoOutput } from "@myorg/shared/form";
import { LandingToken } from "@/generated/prisma";
import { randomUUID } from "crypto";

@Injectable()
export class LandingTokenService {
    constructor(
        private prisma: PrismaService,
        private requestContext: RequestContextService,
    ) {}

    private buildUrl(landingId: string, token: string): string {
        return `${this.requestContext.origin}/${landingId}/${token}`;
    }

    private map(t: LandingToken): LandingTokenDto {
        return {
            id: t.id,
            token: t.token,
            note: t.note,
            url: this.buildUrl(t.landingId, t.token),
            landingId: t.landingId,
            createdAt: t.createdAt.toISOString(),
        };
    }

    async getAll(
        landingId: string,
        page: number,
        limit: number,
        order: string = "desc",
        query: string = "",
    ): Promise<PagedResult<LandingTokenDto>> {
        const q = query.trim();
        const where = {
            landingId,
            ...(q && { note: { contains: q, mode: "insensitive" as const } }),
        };

        const [tokens, total] = await Promise.all([
            this.prisma.landingToken.findMany({
                where,
                orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.landingToken.count({ where }),
        ]);

        return {
            data: tokens.map((t) => this.map(t)),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    async create(
        landingId: string,
        { note }: UpdateNoteLandingTokenDtoOutput,
    ): Promise<LandingTokenDto> {
        const landing = await this.prisma.landing.findUnique({ where: { id: landingId } });
        if (!landing) throw new NotFoundException();

        const token = randomUUID();
        const created = await this.prisma.landingToken.create({
            data: { landingId, token, note: note ?? null },
        });

        return this.map(created);
    }

    async delete(landingId: string, tokenId: string): Promise<void> {
        const token = await this.prisma.landingToken.findFirst({
            where: { id: tokenId, landingId },
        });
        if (!token) throw new NotFoundException();
        await this.prisma.landingToken.delete({ where: { id: tokenId } });
    }

    async updateNote(
        landingId: string,
        tokenId: string,
        { note }: UpdateNoteLandingTokenDtoOutput,
    ): Promise<LandingTokenDto> {
        const token = await this.prisma.landingToken.findFirst({
            where: { id: tokenId, landingId },
        });
        if (!token) throw new NotFoundException();

        const updated = await this.prisma.landingToken.update({
            where: { id: tokenId },
            data: { note: note ?? null },
        });

        return this.map(updated);
    }
}
