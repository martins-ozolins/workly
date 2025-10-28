import { Router } from "express";
import { OrganisationController } from "./organisation.controller.js";

const router = Router();
const organisationController = new OrganisationController();

router.get("/", organisationController.getAllOrganisations);
router.get("/:id", organisationController.getOrganisation);
router.post("/", organisationController.createOrganisation);
router.patch("/:id", organisationController.updateOrganisation);
router.delete("/:id", organisationController.deleteOrganisation);

export default router;
