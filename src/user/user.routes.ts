import express from "express";
import {
  createUserController,
  getUserByIdController,
  queryUserController,
  updateUserController,
  deleteUserControler,
  verifyEmailController,
  resetPasswordHandler,
  forgotPasswordHandler,
} from "./user.controller";

const router = express.Router();

router.post("/create", createUserController);
router.get("/:id", getUserByIdController);
router.get("/query/:type", queryUserController);
router.patch("/update/:id", updateUserController);
router.delete("/delete/:id", deleteUserControler);
router.get("/verify/:id/:code", verifyEmailController);
router.post("/forgot", forgotPasswordHandler);
router.post("/reset/:id/:code", resetPasswordHandler);

export default router;
