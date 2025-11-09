import { describe, it, expect } from "vitest";
import {
  createMemberSchema,
  MemberStatusEnum,
  RoleEnum,
  updateMemberSchema,
} from "./member.validators.js";

describe("Member Validators", () => {
  describe("createMemberSchema", () => {
    it("should validate a valid member creation input", () => {
      const validInput = {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        role: "admin",
        name: "John Doe",
        email: "john.doe@example.com",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "active",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const invalidInput = {
        userId: null,
        role: "admin",
        name: "John Doe",
        email: "not an email",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "active",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject empty name input", () => {
      const invalidInput = {
        userId: null,
        role: "admin",
        name: null,
        email: "not an email",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "active",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject name that is more than 255 chars", () => {
      const invalidInput = {
        userId: null,
        role: "admin",
        name: "a".repeat(256),
        email: "valid@example.com",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "active",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject invalid role", () => {
      const invalidInput = {
        userId: null,
        role: "random one",
        name: "John Doe",
        email: "valid@example.com",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "active",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject invalid status", () => {
      const invalidInput = {
        userId: null,
        role: "admin",
        name: "John Doe",
        email: "valid@example.com",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "random one",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject invalid UUID format for userId", () => {
      const invalidInput = {
        userId: "not uuid",
        role: "admin",
        name: "John Doe",
        email: "valid@example.com",
        dept: "Engineering",
        startDate: "2024-01-15T00:00:00.000Z",
        status: "active",
        country: "USA",
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject invalid UUID format for userId", () => {
      const invalidInput = {
        userId: null,
        role: "admin",
        name: "John Doe",
        email: "valid@example.com",
        dept: null,
        startDate: null,
        status: "active",
        country: null,
      };

      const result = createMemberSchema.safeParse(invalidInput);
      expect(result.success).toBe(true);
    });
  });

  describe("RoleEnum", () => {
    it("should accept valid roles", () => {
      expect(RoleEnum.safeParse("admin").success).toBe(true);
      expect(RoleEnum.safeParse("hr").success).toBe(true);
      expect(RoleEnum.safeParse("employee").success).toBe(true);
    });

    it("should reject invalid roles", () => {
      expect(RoleEnum.safeParse("random one").success).toBe(false);
    });
  });

  describe("MemberStatusEnum", () => {
    it("should accept valid statuses", () => {
      expect(MemberStatusEnum.safeParse("active").success).toBe(true);
      expect(MemberStatusEnum.safeParse("vacation").success).toBe(true);
      expect(MemberStatusEnum.safeParse("paid_leave").success).toBe(true);
    });

    it("should reject invalid statuses", () => {
      expect(MemberStatusEnum.safeParse("random one").success).toBe(false);
      expect(MemberStatusEnum.safeParse("random one 2").success).toBe(false);
    });
  });

  describe("updateMemberSchema", () => {
    it("should validate a valid member update input", () => {
      const validInput = {
        role: "admin",
        name: "John Doe",
        email: "john.doe@example.com",
        dept: "Engineering",
        startDate: null,
        status: "active",
        country: "USA",
      };

      const result = updateMemberSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  // TODO: Add tests for:
  // - updateMemberSelfSchema
});
