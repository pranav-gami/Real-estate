import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import apiRouter from "./routes/apiRoutes";
import connectDB from "./config/db";

dotenv.config();
const app = express();

// MIDDLEWARE TO PARSE DATA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALL API's ROUTES
app.use("/api", apiRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.send("Server is up and  running...");
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
