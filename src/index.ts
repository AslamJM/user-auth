import express from "express";
import cors from "cors";
import { connectDB } from "./utils/connection";
import { PORT } from "./utils/constants";
import UserRouter from "./user/user.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());

app.get("/", (_, res) => res.json({ message: "pinged" }));
app.use("/api/users", UserRouter);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`server is listening at  http://localhost:${PORT}`)
  );
};

startServer();
