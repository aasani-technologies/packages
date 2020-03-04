import { config } from "dotenv";
import helmet from "helmet";
import cors from "cors";
import responseTime from "response-time";
import { json, urlencoded } from "body-parser";
import { Request, Response, NextFunction, RequestHandler } from "express";
import RateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export interface RawRequest extends Request {
  rawBody: string;
}

config();

export * from "@overnightjs/core";
export { slowDown, RateLimit };
export { Request, Response, NextFunction, RequestHandler } from "express";

export const jsonAsyncResponse = (fn: RequestHandler) =>
  function asyncUtilWrap(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const fnReturn = fn(request, response, next);
    return Promise.resolve(fnReturn).catch(next);
  };

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
  app.use(
    json({
      verify: (request: RawRequest, response, buffer) => {
        if (request.query.raw) {
          request.rawBody = buffer.toString();
        }
      }
    })
  );
};
