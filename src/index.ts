import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/routes";
import viewRouter from "./routes/viewsRoutes";

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
//SETTING UP VIEW-TEMPLATE & SETTING VIEW'S DIRECTORy

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// LAYOUT SETUP FOR EJS TEMPLATES

app.use(expressEjsLayouts);
app.set("layout", "layouts/userLayout");

// MIDDELEWARE TO PARSE DATA (BODY & FORM DATA)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API & VIEWS ROUTES
app.use("/api", apiRouter);
app.use("/", viewRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.send("Server is up and  running...");
});

const PORT = process.env.PORT;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
