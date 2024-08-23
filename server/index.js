/* eslint-disable no-unused-vars */
import dotenv from "dotenv";
import express from "express";
import {dbConnection} from "./components/index.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, routeNotFound } from "./middleware/errorWare.js";

dotenv.config();

dbConnection();

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: [process.env.BASE_APP_URL,"https://taskmanager-by-yadnesh.netlify.app","http://localhost:4555/","http://localhost:4555","https://taskmanager-by-yadnesh.netlify.app/"],
    method: ["GET","PUT","POST","DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api",routes);
app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, ()=> console.log('Listening on port',PORT));
