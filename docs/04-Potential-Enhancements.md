# Potential Enhancements

I built this whole project from scratch within a time frame of ~11 hours,
so I had to skip quite a bit of things to keep the scope reasonable.

Here are some things that I think could be done if I had more time,
and some ideas I had that require changing the scope (in a good way).

## General/Architecture

### Testing

I think for any app that will hit production, some form of automated testing should be done.
Static typing provide a certain amount of protection, but I would be much more confident if the whole app had decent unit/integration tests.
It would also be appropriate to test end-to-end flows.

If I were to write tests for this project, I would most likely use the tools below:

- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)

The two libraries listed above are for unit/integration testing.
I think they provide the best testing experience -
I choose RTL over Enzyme because it encourages behaviour testing and discourages testing internals.

- [Selenium](https://www.selenium.dev/)
- [Puppeteer](https://pptr.dev/)
- [Cypress](https://www.cypress.io/)

Of the three libraries listed above, I would choose one or more depending on the situation.
If cross-browser compatibility testing is needed, it is hard to beat Selenium for that (it even supports IE).
If general interaction behaviour testing is needed, then I would choose Cypress/Puppeteer,
depending on whether I need more control of the browser itself, or a simpler testing framework to work with.

### Linting

Because I am working on this my own, I have left out linting ([ESLint](https://eslint.org/)) in this project.
If this project had collaboration, I would advocate to add linting from the start (adding it mid-way is more painful).

I think, linting, when configured to a certain strictness, provides helpful feedback to sticking to the best practices and should yield better quality.
To a certain extent it would also be helpful to enforce stylistic approaches via linting (e.g. `const` v.s. `let`):
that would require people agreeing on the convention beforehand,
but can safe a lot of time in communication/review/arguing later down the road.

### TypeScript Setup

Starting from TypeScript 3.0, it is possible to use project references to enable some optimization on the TypeScript compiler, such as incremental compilation.
It might not be as crucial for this project, but for larger ones (esp. monorepos) it will be very useful:

- It reduces the time in compiling/type-checking (no separate instances needed for each service)
- It reduces memory usage for IDEs (since TypeScript now has a module graph)

In this mode the TypeScript compiler will behave more like an orchestrator than a compiler.

### Dockerising the application

This is strictly optional (and quite redundant for the client since it is static),
but it will ease the deployment process (esp. if SSR is used instead of CSR).

## Client Side

### Component Development

I really liked the visual development loop [Storybook](https://storybook.js.org/) provides while I was working on a design system.
I think it provides a very good way to isolate slices of an app and craft its UI/test its various states without having to deal with the interactions between components.
It can further act as a documentation of the components' APIs.

In addition to development, it also provides a good way to run visual regression tests (e.g. [Chromatic](https://www.chromatic.com/)).
That way, designers can also review what we've implemented.

I would have added this if I had to work on separate pages in collaboration with other people,
or had to work with designers to progressively build out an application.

### State Management

In the current implementation, since the state is simple enough, I did not use any library to manage state.
If this app was 2x larger and 2x more complex, I would not be so confident with React context and local state.

Depending on the situation, I will be comfortable using:

- [Redux](https://redux.js.org/) with Redux-Toolkit;
- [MobX](https://mobx.js.org/)

I think the two libraries have different trade-offs:
Redux is more explicit/transactional and less magical;
MobX is more reactive and probably tiny bit simpler when orchestrated correctly.

### Autocomplete

Since there are only ever so many countries on the planet,
I think it is possible to add auto-completing behaviour to the country input box (sort of a drop down).

It would drastically boost UX and increase usability of the application.

### Table Functionalities

In this case since we're dealing with countries, this might be a bit overkill (only hundreds of countries exist).
However, for maximum performance, it would be better to utilize virtualisation to make sure only what the user sees are rendered on screen.

For better UX, it might also be good to add sorting for each column of the table (e.g. by Name/Population).
It would allow users to better see how each row "rank" in the pack.

(Maybe we can also add flags to the country names?)

### Design/Responsiveness

Since time is limited I decided to stick mostly to Material-UI's default look,
but I do think that I can do better in terms of design and layout,
especially with the error flows.

I might also rethink the idea of using a table and switch to something more fluid (using flex box to their full potential, for example) if I wanted to achieve "responsiveness"
(i.e. if I want the project to be enjoyable on mobile screens).

### Throttling

While I think server-side rate limiting is robust, it would also be useful if I added rate limiting in client side,
so we can prevent misuse without having to hit the server.

However, since data fetching is asynchronous, it would require some sort of Promise-based throttling,
and most of the libraries I know are for Node.js.

### Favicons

In my previous projects, I would utilize some FavIcon generator to generate a matrix of icons.
It would help with discoverability of the application in some cases:

- Desktop Safari
- PWA (both iOS/Android)
- Windows Metro UI

### Edge Cases

While building this application, I've hit some edge cases related to currencies and countries.

#### Searching by the same country but with a different phrase

In the current implementation, I forcefully run an unique algorithm on the full data to prevent rows from showing up twice,
but I think this could be done better if autocomplete was implemented,
or if we can check in advance if the new searching phrase actually equates to some already available rows.

#### Multi-currency

To my knowledge, there are still countries that have two official currencies (e.g. Cuba).
The current implementation handles the display of these cases by showing them all, each on a separate line,
but this makes the rows "fatter" and in a design standpoint it might not be as pleasing.

## Server Side

### OAuth Flows

This is something that is out of scope, but would be a priority for any services that are not 100% public.

In this project I've used an API to generate JWTs (similar to the Implicit Grant flow),
but for more robust authentication I would probably use a server-side session (and the Authorization Code flow, with Authorization Tokens and Refresh Tokens).
This would require some form of database and probably SSR which I deliberately chose to drop in the current implementation.

Using OAuth would also mean that we can have more security measures in place, such as PKCE.

### Reduce Fingerprinting

This is a bit of a sensitive topic - for convenience I chose to use the users' IP address in the JWT's payload,
but in real life apps this is probably not a very good idea because of all the data retention laws (esp. in the EU).

Realistically if I am still generating JWTs for anonymous users, I might use [nanoid](https://github.com/ai/nanoid) to generate unique identifiers.

### External API Enhancements

Since we depend on external data sources to serve our APIs,
it might be valuable to not fail immediately when the external service return an error.
We could, for example, implement a "retry mechanism" to recover in some cases (e.g. network went down for a second).

It is also possible to implement some sort of in-memory/external cache (e.g. Redis) for the received data,
so we will never have to call external APIs when the same pieces of data are needed.
