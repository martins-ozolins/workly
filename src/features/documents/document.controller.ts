import type { Request, Response, NextFunction } from "express";
import { DocumentService } from "./document.service.js";

export class DocumentController {
  private documentService = new DocumentService();

  /**
   * POST /:slug/members/:memberId/documents - Upload new document
   *
   * Handles: File upload to S3 + metadata storage in DB
   * Request params: slug, memberId
   * Request body: multipart/form-data with file and metadata
   *
   * Returns: newly created document with S3 URL
   *
   * Access: Admin, HR, or the member themselves
   */
  uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement file upload to S3 and metadata storage
      // 1. Extract slug and memberId from req.params
      // 2. Validate member exists and belongs to organisation
      // 3. Process file upload (using multer or similar)
      // 4. Upload file to S3
      // 5. Create document record with S3 URL
      res
        .status(201)
        .json({ message: "Document uploaded - not implemented yet" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /:slug/members/:memberId/documents/:documentId - Get/download document
   *
   * Request params: slug, memberId, documentId
   *
   * Returns: document metadata and presigned S3 URL for download
   *
   * Access: Admin, HR, or the member themselves
   */
  getDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement get/download document
      // 1. Extract slug, memberId, and documentId from req.params
      // 2. Validate document exists and belongs to member
      // 3. Generate presigned S3 URL for download
      // 4. Return document metadata with download URL
      res.json({ message: "Get document - not implemented yet" });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /:slug/members/:memberId/documents/:documentId - Delete document
   *
   * Request params: slug, memberId, documentId
   *
   * Returns: deletion confirmation
   *
   * Access: Admin or HR only
   */
  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement document deletion
      // 1. Extract slug, memberId, and documentId from req.params
      // 2. Validate document exists and belongs to member
      // 3. Delete file from S3
      // 4. Delete document record from DB
      res.json({ message: "Delete document - not implemented yet" });
    } catch (error) {
      next(error);
    }
  };
}
