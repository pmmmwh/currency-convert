import cors = require('cors');
import dotenv = require('dotenv');
import express = require('express');
import rateLimit = require('express-rate-limit');
import httpErrors = require('http-errors');
import jwt = require('jsonwebtoken');
import passport = require('passport');
import httpBearer = require('passport-http-bearer');
import countryDataHandler = require('./countryData');
import type { NextFunction, Request, Response } from 'express';

// Read environment variables from .env
dotenv.config();

// Ensure necessary environment variables are defined
const {
  ACCESS_KEY,
  PORT = '3001',
  SECRET_KEY,
}: { ACCESS_KEY?: string; PORT?: string; SECRET_KEY?: string } = process.env;
if (!ACCESS_KEY) {
  throw new Error('Server requires a Fixer access key!');
}
if (!SECRET_KEY) {
  throw new Error('Server requires a secret key for authentication!');
}

const app = express();

// Setup rate limiting
const limiter = rateLimit({
  keyGenerator(req) {
    // @ts-ignore
    // Rate limit by users' token -
    // The property will be injected via the `passport.authenticate` middleware
    return req.user?.token;
  },
  max: 30,
  message: httpErrors(429),
  windowMs: 60 * 1000, // 1 minute
});

// Setup Passport for JWT authentication
passport.use(
  new httpBearer.Strategy((token, done) => {
    try {
      // DT types are a bit messed up here -
      // according to official docs the verify method returns the decoded signature.
      const decoded = jwt.verify(token, SECRET_KEY, {
        // Only allow the algorithm we used
        algorithms: ['HS512'],
        // Verify token issuer
        issuer: 'currency-convert',
      }) as Record<string, unknown>;
      // Pipe token information (which contains users' IP),
      // as well as the token itself (for rate limiting) as the request's identifier.
      return done(null, { ...decoded, token });
    } catch (error) {
      // This indicates the JWT is malformed, so we report a 'Bad Request'.
      if (error instanceof jwt.JsonWebTokenError) {
        return done(httpErrors(400));
      }
      // This indicates the JWT is expired, so the user is effectively 'unauthenticated'.
      if (error instanceof jwt.TokenExpiredError) {
        return done(httpErrors(401));
      }

      // Something went wrong - default to 500
      return done(error);
    }
  })
);

// Accept CORS from all domains (`*`)
app.use(cors());

// Initialize Passport
app.use(passport.initialize());

// JWT API
app.post('/login', (req, res) => {
  // Use users' IP as a pseudo-identifier (since they are anonymous)
  const token = jwt.sign({ ip: req.ip }, SECRET_KEY, {
    algorithm: 'HS512',
    expiresIn: '12h',
    issuer: 'currency-convert',
  });
  res.json({ token });
});

// Country Data API
app.get(
  '/country/:countryName',
  passport.authenticate('bearer', { session: false }),
  limiter,
  countryDataHandler
);

// Catch 404 errors and forward to the global error handler
app.use((_, __, next) => next(httpErrors(404)));

// Global error handler
app.use((error: Error & { status?: number }, _: Request, res: Response, __: NextFunction) => {
  // Log errors in server-side
  console.error(error);

  const errorStatus = error?.status ?? 500;
  return res.status(errorStatus).json(httpErrors(errorStatus));
});

// Start the server
const server = app.listen(parseInt(PORT, 10), () => {
  let serverAddress = server.address();
  if (typeof serverAddress === 'object' && serverAddress !== null) {
    serverAddress = `http://${serverAddress.address}:${serverAddress.port}`;
  }

  console.log(`App listening at ${serverAddress ?? 'unknown'}`);
});
