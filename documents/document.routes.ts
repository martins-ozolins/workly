import { Router } from "express";
import { DocumentController } from "./document.controller.js";

const router = Router();
const documentController = new DocumentController();

router.get("/", documentController.getAllDocuments);
router.get("/expiring-soon", documentController.getExpiringSoon);
router.get("/:id", documentController.getDocument);
router.get("/member/:memberId", documentController.getDocumentsByMember);
router.post("/", documentController.createDocument);
router.patch("/:id", documentController.updateDocument);
router.delete("/:id", documentController.deleteDocument);

export default router;
