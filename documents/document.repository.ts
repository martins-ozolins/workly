import { prisma } from "../../config/prisma.js";
import type { CreateDocumentDto, UpdateDocumentDto } from "./document.types.js";

export class DocumentRepository {
  /**
   * Query: Find document by ID
   *
   * Returns: document with member and organisation details
   */
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

  /**
   * Query: Find documents by member ID
   *
   * Returns: list of documents ordered by creation date
   */
  async findByMember(memberId: string) {
    return prisma.document.findMany({
      where: { memberId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Query: Find all documents
   *
   * Returns: list of documents with member details ordered by creation date
   */
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

  /**
   * Query: Create new document
   *
   * Returns: newly created document with member details
   */
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

  /**
   * Query: Update document
   *
   * Returns: updated document with member details
   */
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

  /**
   * Query: Delete document
   *
   * Returns: deleted document
   */
  async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }

  /**
   * Query: Find documents expiring soon
   *
   * Returns: list of documents expiring within specified days ordered by expiration
   */
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
