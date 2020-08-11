# Client Service

The client service is implemented with [React](https://reactjs.org) (with TypeScript),
then built with Babel for transpiling and polyfilling,
and Webpack for bundling.

## Technical Choices

### Why Only ES2017+?

I made the choice to only support browsers that runs ES2017+ because:

- This application is targeting other developers
- I didn't want the polyfill "bloat" coming from transpiling ES6 features to ES5 (e.g. Promise, Generators ...),
  which also means faster compilation and development iterations
- I think this is a decent choice for all modern applications,
  and if ES5 support is really needed (e.g. IE11) one can always create another bundle using the `module`/`nomodule` method,
  in which this bundle would be the one with `module`.

### Why Configure Webpack Manually?

I basically wanted to challenge myself to create a decent enough setup by running my own Webpack configuration.
(Plus I wanted to use my own work on React Refresh for development!)

If speed is really the only concern, I would have used [create-react-app](https://create-react-app.dev) or [Next.js](https://nextjs.org).
If both speed and customisation are needed, then I would probably go for a custom Webpack template generated from the two meta-frameworks listed above.

### Why Client Side Render?

I have used SSR (server side render) extensively in my previous work (with [Next.js](https://nextjs.org)),
but I think the simplistic and single-paged nature of the application does not warrant going full SSR.

Another reason for that is I wanted to implement the server completely separated from the client for this project,
and using SSR would defeat that purpose (or yield two servers).

However, if the requirements were to change a slight bit, I would have used SSR from the start:

- If fully sound authentication is required (e.g. OAuth flows utilizing session);
- If there are multiple distinct pages/views;
- If there exists more complexity in the data fetching layer (e.g. multiple private APIs with authorization);
- If performance/first paint times have to be prioritized (e.g. trying to boost Lighthouse scores);
- If SEO needs to be perfect (FB meta tags, separate title for each page, etc.).

### Why Use Babel for TypeScript?

I already needed a Babel pass for a few things (like transforming Material-UI imports for better tree-shaking),
and I didn't want to have another parsing step (with `ts-loader`).

To make up for the missing type checking I utilized `fork-ts-checker-webpack-plugin`,
which basically spawns `tsc` in another process to not block bundling.

## Dependencies Used

### Material-UI

I think it is the most complete and bateries included component library that exists in the React ecosystem.
With very little effort it provided basically all of my needs to build this app (with great themability).

If I were to build this for a specific design though, I might have used other less opinionated tools and run our own components:

- [Styled System](https://styled-system.com/)
- [React Spectrum](https://react-spectrum.adobe.com/react-spectrum)
- [Reach UI](https://ui.reach.tech/)

### CLSX

Basically the tiniest class name concatenation tool I know that exists,
and is what Material-UI uses in its core so we don't need to bundle two packages for the same thing.

### Ky

A tiny HTTP client based on fetch that provides a similar experience to the famous/notorious [axios](https://github.com/axios/axios).

To me, Ky being focused for usage in the browser is a big win.
The library is also smaller and more modern (axios uses `XMLHttpRequests` which does capabilities that `fetch` can't match but I don't use them).
There is also support for retrying (which I didn't utilize).

### React Error Boundary

This is just me being lazy and didn't want to implement my own error boundary.
However, if error reset functionality is needed, this package does have that provided out of the box and could be handy.

### React Number Format

This package is one of the better ways (as I recall) to implement a "number" input properly.
It supports rich formatting and guards against invalid input.

I might have been able to use the `tel` input type,
which will yield a number keyboard in most mobile platforms,
but it would not allow decimals/negative values which I wanted to support.

### React Query

This is a very new library to do data fetching in React, utilizing the power of hooks.
I think it provides the best primitives for all sorts of CRUD operations.

It has caching (with stale-while-revalidate mechanisms), mutations (`POST`/`PUT` requests),
retrying (with exponential delay) and even infinite fetching built in.
It's almost all of what most will ever need for data fetching.
