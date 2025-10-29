import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { prisma } from "../config/prisma.js";
import { APIError } from "better-auth/api";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  plugins: [admin()],
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
  // user: {
  //   additionalFields: {
  //     role: {
  //       type: "string",
  //       input: false,
  //     },
  //   },
  // },
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if (ctx.path.startsWith("/sign-up")) {
        if (ctx.context.returned instanceof APIError) return;
        const newSession = ctx.context.newSession;
        if (newSession) {
          // Link newly registered user to all member records with the same email
          await prisma.member.updateMany({
            where: { userId: null, email: newSession.user.email },
            data: { userId: newSession.user.id },
          });
        }
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
