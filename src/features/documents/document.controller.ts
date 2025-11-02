import type { Request, Response, NextFunction } from "express";
import { DocumentService } from "./document.service.js";
import { Errors } from "../../shared/errors/AppError.js";
import {
  completeDocumentUploadSchema,
  deleteDocumentSchema,
  getDocumentSchema,
  getDocumentsSchema,
  uploadDocumentSchema,
} from "./document.validators.js";
import { formatZodErrors } from "../../utils/formatZodErrors.js";

export class DocumentController {
  private documentService = new DocumentService();

  /**
   * POST /:slug/members/:memberId/documents
   * Initiates document upload, stores metadata, generates presigned S3 upload URL
   * Returns: documentId, key, uploadUrl (valid 300s)
   * Access: Admin, HR, or member
   */
  uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve organisation id + member id whose profile is being edited
      const memberId = req.params.memberId;
      const orgId = req.organisationId;

      // Check required data from middleware
      if (!memberId || !orgId) {
        throw Errors.notFound();
      }

      // Validate data based on the schema (file is uploaded from frontend to S3)
      const validationResult = uploadDocumentSchema.safeParse(req.body);
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }
      const { fileName, fileType, documentType } = validationResult.data;

      // Delegate to service
      const result = await this.documentService.uploadDocument({
        fileName,
        fileType,
        documentType,
        memberId,
        orgId,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /complete
   * Confirms document uploaded to S3, validates size
   * Returns: confirmation
   * Access: Admin, HR, or member
   */
  completeDocumentUpload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validate data based on the schema
      const validationResult = completeDocumentUploadSchema.safeParse(req.body);

      // Throw an error and pass formatted validation results
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }
      const { documentId, expectedSize } = validationResult.data;

      // Delegate to service
      const result = await this.documentService.completeDocumentUpload(
        documentId,
        expectedSize
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /:slug/members/:memberId/documents
   * Lists all READY documents for a member
   * Returns: array of documents
   * Access: Admin, HR, or member
   */
  getDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate data based on the schema
      const validationResult = getDocumentsSchema.safeParse({
        memberId: req.params.memberId,
        organisationId: req.organisationId,
      });

      // Throw an error and pass formatted validation results
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

      const documents = await this.documentService.listDocumentsByMember(
        validationResult.data
      );

      res.json(documents);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /:slug/members/:memberId/documents/:documentId
   * Gets presigned S3 download URL, redirects to it
   * Returns: 302 redirect to download URL (valid 90s)
   * Access: Admin, HR, or member
   */
  getDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate data based on the schema
      const validationResult = getDocumentSchema.safeParse(req.body);

      // Throw an error and pass formatted validation results
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

      const url = await this.documentService.getDocument(validationResult.data);

      res.redirect(302, url);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /:slug/members/:memberId/documents/:documentId
   * Deletes document from S3 and marks as DELETED in DB
   * Returns: confirmation
   * Access: Admin or HR only
   */
  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate data based on the schema
      const validationResult = deleteDocumentSchema.safeParse({
        documentId: req.params.documentId,
        memberId: req.params.memberId,
        organisationId: req.organisationId,
      });

      // Throw an error and pass formatted validation results
      if (!validationResult.success) {
        throw Errors.validation({ details: formatZodErrors(validationResult) });
      }

      const result = await this.documentService.deleteDocument(
        validationResult.data
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
