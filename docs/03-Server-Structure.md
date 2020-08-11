# Client Service

The server service is implemented with [Express](https://expressjs.com) (with TypeScript).

## Technical Choices

### Why Express?

It is the most popular Node.js server framework out there,
and is what I'm the most familiar with.

For a newer apps though, I think [Koa](https://koajs.com) is also a solid choice.

## Dependencies Used

### Cors

Because the server will be running separately from the client,
it is important we properly handle CORS (so that the client can call the API successfully from the browser).
Cors is the simplest middleware I know for the Express ecosystem to deal with these kinds of issues.

### Express Rate Limit

Express-Rate-Limit is the simplest API rate limiter middleware I know.
It provides a simple API for me to limit according to the request's token (JWT).

### Got

I use got similarly to why I use ky for the client - it is a modern, batteries included HTTP request library.
It is probably the most powerful client out there, providing support for HTTP/2, caching, retries, streams, etc.

### HTTP Errors

This is a tiny library to create JSON responses for APIs from status codes.
I just didn't want to hand write them.

### JsonWebToken

The de-facto library to generate JWTs in Node.js from the people who created the JWT spec.
There are a few things that I don't like about it (including no Promise support), but I stuck with it due to familiarity.

An alternative would be [jose](https://github.com/panva/jose).

### Passport

Passport is probably one of the most popular and the most extensible (numerous integrations) authentication middleware for Node.js.
It provides a simple API for me to add Bearer token authentication (JWT) into the APIs.
It was picked because of familiarity, but I also like that it is quite flexible.

### Passport HTTP Bearer

A Passport strategy that simplifies Bearer token authentication - it handles token extraction, so I only need to deal with validation.
