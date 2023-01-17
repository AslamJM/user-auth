import { config } from "dotenv";

config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_DB!;

export const testMailCreds = {
  user: "golda28@ethereal.email",
  pass: "SqCaR35S7WvZsjKt4A",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
};
