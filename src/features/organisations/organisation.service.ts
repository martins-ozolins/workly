import { OrganisationRepository } from "./organisation.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
  CreateOrganisationInput,
  UpdateOrganisationInput,
} from "./organisation.validators.js";

export class OrganisationService {
  private organisationRepository = new OrganisationRepository();

  async getOrganisationById(id: string) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }
    return organisation;
  }

  async getOrganisationBySlug(id: string) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }
    return organisation;
  }

  async getAllOrganisations() {
    return this.organisationRepository.findAll();
  }

  async createOrganisationWithAdmin(
    data: CreateOrganisationInput,
    currentUser: {
      userId: string;
      email: string;
      name: string;
    }
  ) {
    return this.organisationRepository.createWithAdmin(data, currentUser);
  }

  async updateOrganisation(id: string, data: UpdateOrganisationInput) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }

    return this.organisationRepository.update(id, data);
  }

  async deleteOrganisation(id: string) {
    const organisation = await this.organisationRepository.findById(id);
    if (!organisation) {
      throw new AppError("Organisation not found", 404);
    }

    await this.organisationRepository.delete(id);
    return { message: "Organisation deleted successfully" };
  }
}
