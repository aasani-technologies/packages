import helmet from "helmet";
import cors from "cors";
import responseTime from "response-time";
import { json, urlencoded } from "body-parser";

export const setupMiddleware = (app: any) => {
  if (!process.env.DISALLOW_OPEN_CORS)
    app.use(
      cors({
        maxAge: process.env.CORS_MAXAGE
          ? parseInt(process.env.CORS_MAXAGE)
          : 600
      })
    );
  if (!process.env.DISABLE_HELMET)
    app.use(
      helmet(
        process.env.HELMET_CONFIG
          ? JSON.parse(process.env.HELMET_CONFIG)
          : { hsts: { maxAge: 31536000, preload: true } }
      )
    );
  if (!process.env.DISABLE_RESPONSE_TIME) app.use(responseTime());
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: "50mb" }));
};
