import { Router } from "express";
import { DocumentController } from "./document.controller.js";

const router = Router();
const documentController = new DocumentController();

// Routes are mounted at /:slug/members/:memberId/documents

// POST /initiate => Return presigned PUT URL + creates Document (PENDING)
router.post("/initiate", documentController.uploadDocument);

// POST /complete => Verify S3 object (HEAD), saves size/hash, creates Document (READY)
router.post("/complete", documentController.completeDocumentUpload);

// GET / => Get a list of member documents
router.get("/", documentController.getDocuments);

// GET /:documentId => Get/download specific document
router.get("/:documentId", documentController.getDocument);

// DELETE /:documentId => Delete document (from S3 and DB)
router.delete("/:documentId", documentController.deleteDocument);

export default router;
