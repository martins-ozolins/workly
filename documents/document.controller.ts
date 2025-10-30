import type { Request, Response, NextFunction } from "express";
import { DocumentService } from "./document.service.js";
import {
  createDocumentSchema,
  updateDocumentSchema,
} from "./document.validators.js";
import { AppError } from "../../shared/errors/AppError.js";

export class DocumentController {
  private documentService = new DocumentService();

  /**
   * GET /documents/:id - Get document by ID
   *
   * Returns: document details
   *
   * Access: Authenticated users
   */
  getDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const document = await this.documentService.getDocumentById(
        req.params.id
      );
      res.json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /documents - Get all documents
   *
   * Returns: list of all documents
   *
   * Access: Authenticated users
   */
  getAllDocuments = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const documents = await this.documentService.getAllDocuments();
      res.json(documents);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /documents/member/:memberId - Get documents by member
   *
   * Returns: list of documents for specific member
   *
   * Access: Authenticated users
   */
  getDocumentsByMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const documents = await this.documentService.getDocumentsByMember(
        req.params.memberId
      );
      res.json(documents);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /documents/expiring-soon - Get documents expiring soon
   *
   * Returns: list of documents expiring within specified days
   *
   * Access: Authenticated users
   */
  getExpiringSoon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const documents =
        await this.documentService.getExpiringSoonDocuments(days);
      res.json(documents);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /documents - Create new document
   *
   * Returns: newly created document
   *
   * Access: Admin or HR
   */
  createDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = createDocumentSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(validationResult.error.errors[0].message, 400);
      }

      const documentData = {
        ...validationResult.data,
        expiresAt: validationResult.data.expiresAt
          ? new Date(validationResult.data.expiresAt)
          : undefined,
      };

      const document = await this.documentService.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /documents/:id - Update document
   *
   * Returns: updated document details
   *
   * Access: Admin or HR
   */
  updateDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = updateDocumentSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw new AppError(validationResult.error.errors[0].message, 400);
      }

      const documentData = {
        ...validationResult.data,
        expiresAt: validationResult.data.expiresAt
          ? new Date(validationResult.data.expiresAt)
          : undefined,
      };

      const document = await this.documentService.updateDocument(
        req.params.id,
        documentData
      );
      res.json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /documents/:id - Delete document
   *
   * Returns: deletion confirmation
   *
   * Access: Admin only
   */
  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.documentService.deleteDocument(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
