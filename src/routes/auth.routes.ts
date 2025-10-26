import { Router, type Request, type Response } from "express";
import { auth } from "../lib/auth.js";

const router = Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const data = await auth.api.signUpEmail({
      body: {
        name: req.body.name, // required
        email: req.body.email, // required
        password: req.body.password, // required
        image: req.body.image,
        callbackURL: req.body.callbackURL,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(400).json({
      error: error instanceof Error ? error.message : "Sign up failed",
    });
  }
});

export default router;
