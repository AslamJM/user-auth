import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
const HASH_ROUNDS = 10;

export interface IUser extends Document {
  email: string;
  password: string;
  emailVerified: boolean;
  emailVerificationCode: string;
  passwordResetCode: string | null;
  role: "admin" | "student";
  name: string;
  age: number;
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  emailVerified: { type: Boolean, default: false },
  emailVerificationCode: {
    type: String,
    default: Math.random().toString(36).substring(2, 15),
  },
  passwordResetCode: { type: String },
  role: {
    type: String,
    enum: ["admin", "student"],
  },
  name: { type: String },
  age: { type: Number },
});

userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(HASH_ROUNDS);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

userSchema.methods.validatePassword = async function (pass: string) {
  return bcrypt.compare(pass, this.password);
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
