import { Router } from "express";
import { OrganisationController } from "./organisation.controller.js";
import {
  requireAuth,
  requireSystemAdmin,
} from "src/shared/middleware/auth.middleware.js";
import {
  isOrganisationMember,
  isOrganisationAdmin,
  isOrganisationAdminOrHr,
} from "./organisation.middleware.js";

const router = Router();
const organisationController = new OrganisationController();

// system admin route
router.get("/", requireSystemAdmin, organisationController.getAllOrganisations);

// organisation creation (authenticated users)
router.post("/", requireAuth, organisationController.createOrganisation);

// admin view - full control
router.get(
  "/:slug/admin",
  requireAuth,
  isOrganisationAdmin,
  organisationController.getOrganisationAdminView
);

// HR/Admin member management routes
router.get(
  "/:slug/members",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.getOrganisationHrView
);

router.post(
  "/:slug/members",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.addNewMember
);

// TODO: add /:slug/members/:memberId GET route when updating single user to load view data

router.post(
  "/:slug/members/:memberId",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.updateMember
);

router.delete(
  "/:slug/members/:memberId",
  requireAuth,
  isOrganisationAdmin,
  organisationController.deleteMember
);

// Member view - basic org info
router.get(
  "/:slug",
  requireAuth,
  isOrganisationMember,
  organisationController.getOrganisationMemberView
);

// Organisation updates (admin only)
router.post(
  "/:slug",
  requireAuth,
  isOrganisationAdmin,
  organisationController.updateOrganisationBySlug
);

export default router;
