import { prisma } from "../../config/prisma.js";
import type { CreateDocumentDto, UpdateDocumentDto } from "./document.types.js";

export class DocumentRepository {
  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organisation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findByMember(memberId: string) {
    return prisma.document.findMany({
      where: { memberId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findAll() {
    return prisma.document.findMany({
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(data: CreateDocumentDto) {
    return prisma.document.create({
      data: {
        ...data,
        uploadedAt: new Date(),
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateDocumentDto) {
    return prisma.document.update({
      where: { id },
      data,
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }

  async findExpiringSoon(days: number = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.document.findMany({
      where: {
        expiresAt: {
          lte: futureDate,
          gte: new Date(),
        },
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        expiresAt: "asc",
      },
    });
  }
}
