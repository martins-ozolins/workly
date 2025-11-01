import { Router } from "express";
import { OrganisationController } from "./organisation.controller.js";
import {
  requireAuth,
  requireSystemAdmin,
} from "../../shared/middleware/auth.middleware.js";
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

// settings view - org configuration (admin only)
router.get(
  "/:slug/settings",
  requireAuth,
  isOrganisationAdmin,
  organisationController.getOrganisationSettingsView
);

// HR/Admin member management routes
router.get(
  "/:slug/members",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.getOrganisationMembersView
);

// HR/Admin member creation route
router.post(
  "/:slug/members",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.addNewMember
);

// Member edit view (Admin/HR only)
router.get(
  "/:slug/members/:memberId",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.getMemberForEditing
);

// Member edit post route (Admin/HR only)
router.post(
  "/:slug/members/:memberId",
  requireAuth,
  isOrganisationAdminOrHr,
  organisationController.updateMember
);

// Member deactivate route (Admin/HR only)
router.delete(
  "/:slug/members/:memberId",
  requireAuth,
  isOrganisationAdmin,
  organisationController.deactivateMember
);

// Member view - basic org info
router.get(
  "/:slug",
  requireAuth,
  isOrganisationMember,
  organisationController.getOrganisationMemberView
);

// Organisation updates (Admin only)
router.post(
  "/:slug/settings",
  requireAuth,
  isOrganisationAdmin,
  organisationController.updateOrganisationBySlug
);

// Organisation deletion (Admin only)
router.delete(
  "/:slug",
  requireAuth,
  isOrganisationAdmin,
  organisationController.deleteOrganisation
);

export default router;
