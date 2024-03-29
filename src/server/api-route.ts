import cookieSession from "cookie-session";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { error } from "next/dist/build/output/log";

import passport from "./passport";
import { trustProxyMiddleware } from "./trust-proxy-middleware";

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
  files: any;
}

const COOKIE_SECRET = process.env.COOKIE_SECRET;

/**
 * Create an API route handler with next-connect and all the necessary middlewares
 *
 * @example
 * ```ts
 * export default handler().get((req, res) => { ... })
 * ```
 */
function handler({ onError }: { onError?: any } = {}) {
  if (!COOKIE_SECRET)
    throw new Error(`Please add COOKIE_SECRET to your .env.local file!`);

  return (
    nc<Request, NextApiResponse>({
      onError: (err, req, res) => {
        error(err);

        if (onError) {
          return onError(err, req, res);
        }

        return res.status(500).json({
          error: err.toString(),
        });
      },
    })
      // In order for authentication to work on Vercel, req.protocol needs to be set correctly.
      // However, Vercel's and Netlify's reverse proxy setup breaks req.protocol, which the custom
      // trustProxyMiddleware fixes again.
      .use(trustProxyMiddleware)
      .use(
        cookieSession({
          name: "session",
          keys: [COOKIE_SECRET],
          maxAge: 24 * 60 * 60 * 1000 * 30,
          // Do not change the lines below, they make cy.auth() work in e2e tests
          secure:
            process.env.NODE_ENV !== "development" &&
            !process.env.INSECURE_AUTH,
          signed:
            process.env.NODE_ENV !== "development" &&
            !process.env.INSECURE_AUTH,
        })
      )
      .use(passport.initialize())
      .use(passport.session())
  );
}

export default handler;
