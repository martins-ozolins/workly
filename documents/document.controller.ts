import type { Request, Response, NextFunction } from "express";
import { DocumentService } from "./document.service.js";
import {
  createDocumentSchema,
  updateDocumentSchema,
} from "./document.validators.js";
import { AppError } from "../../shared/errors/AppError.js";

export class DocumentController {
  private documentService = new DocumentService();

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

  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.documentService.deleteDocument(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
