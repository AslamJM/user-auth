import { Request, Response } from "express";
import { Types, Document } from "mongoose";
import { sendMail } from "../utils/mailservice";
import { IUser } from "./user.model";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  queryUser,
} from "./user.service";

export const createUserController = async (
  req: Request<{}, {}, { input: Partial<IUser> }>,
  res: Response
) => {
  const { input } = req.body;
  try {
    const user = await createUser(input);
    await sendMail({
      from: "admin@purpose.com",
      to: user.email,
      subject: "verify your account",
      text: `VERIFICATION CODE: ${user.emailVerificationCode}    ID: ${user._id}`,
    });
    return res
      .status(200)
      .json({ user, message: "account created please verify your email" });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "email already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

export const verifyEmailController = async (
  req: Request<{ id: string; code: string }>,
  res: Response
) => {
  const { id, code } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(400).send("user does not exist");
    }
    if (user.emailVerified) {
      return res.status(400).send("user is already verified");
    }
    if (user.emailVerificationCode === code) {
      user.emailVerified = true;
      await user.save();
      return res.status(200).send("user verified");
    }
    return res.send("verification code is incorrect");
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    return res.status(200).json({ user, message: "user created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const queryUserController = async (
  req: Request<{ type: "single" | "multiple" }>,
  res: Response
) => {
  const { type } = req.params;
  try {
    const users = await queryUser(req.query, type);
    return res.status(200).json({ users });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, { email: string }>,
  res: Response
) => {
  const { email } = req.body;
  try {
    const user = (await queryUser({ email }, "single")) as Document<
      unknown,
      any,
      IUser
    > &
      IUser & {
        _id: Types.ObjectId;
      };
    if (!user) {
      return res
        .status(200)
        .json({ message: "an email is sent to your email account" });
    }
    if (!user.emailVerified) {
      return res.status(200).json({ message: "verify your email first" });
    }
    const passwordResetCode = Math.random().toString(36).substring(2, 15);
    user.passwordResetCode = passwordResetCode;
    await user.save();

    await sendMail({
      from: "admin@porpose.com",
      to: email,
      subject: "password reset code",
      text: `Password reset code:${passwordResetCode}  ------  ID:${user._id}`,
    });

    return res.json({
      message: "password reset code has been sent to your email",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordHandler = async (
  req: Request<
    {
      id: string;
      code: string;
    },
    {},
    { password: string }
  >,
  res: Response
) => {
  const { id, code } = req.params;
  const { password } = req.body;
  try {
    const user = await getUserById(id);
    if (
      !user ||
      user.passwordResetCode === null ||
      user.passwordResetCode !== code
    ) {
      return res.status(400).json({
        message: "password reset failed",
      });
    }
    user.passwordResetCode = null;
    user.password = password;
    await user.save();

    return res.status(200).json({
      message: "password reset successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserController = async (
  req: Request<{ id: string }, {}, { input: Partial<IUser> }>,
  res: Response
) => {
  const { id } = req.params;
  const { input } = req.body;

  try {
    const user = await updateUser(id, input);
    return res.status(200).json({
      user,
      message: "password reset successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUserControler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await deleteUser(req.params.id);
    return res.status(200).json({
      message: "user deleted",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
