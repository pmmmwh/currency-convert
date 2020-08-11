# General Information

## Project Structure

```
.
├── docs
├── node_modules
├── services
│   ├── client
│   ├── server
│   └── types
├── ...
├── package.json
├── tsconfig.json
└── yarn.lock
```

This repo's structure is highly inspired by the monorepo `packages` structure that many monorepos use.
However, since we're building an app, instead of calling everything as "packages", they are named as "services".

There are currently three main services of this project, with each of them stored under its own sub-directory within the `services` folder:

- client
- server
- types

Only files that are service-agnostic should be stored in root -
some examples of this are formatter/linter configurations (e.g. `.prettierrc.json`) and the root workspace manifest (`package.json`).

For dependencies, they are hoisted at the root of the repo.
This is to provide consistency across all services:
if something is used by multiple services,they probably should be on the same version to be safe.
This also means that the repo will only have a single generated lock file (`yarn.lock`) at root.

## Tooling Choices

### Why Monorepo (and Lerna)?

A lot of people criticize monorepo structures for cryptic tooling and indirection, and they are not wrong for feeling so.
Running commands in monorepos and navigating through the nested directories of packges/services are difficult because they would require non-traditional ways of doing things,
and those ways might go against our own muscle memory.

The main benefit of the monorepo structure, however, is easy encapsulation of service boundaries while keeping them in the same place, which facilitates code sharing.
While we could achieve the same result by using separate directories, adopting a full monorepo structure means that all the cross-file references/deep imports/file linking are handled by the tooling itself for us.
It also enables new ways of development and testing: we don't have to deal with git submodules, or relying on other services ran by other parties - we can just run them all in a single place.

In this project, I chose to use Lerna (a tool that is mostly leaned towards libraries rather than applications) because it is one of the simplest tools for the purpose,
and at the same time it provides APIs to run commands for services and hoist dependencies.

However, in hindsight some other tools that are less heavy-weight/less skewed towards libraries could also be used:

- [Yarn v2 Workspaces](https://yarnpkg.com/features/workspaces) which covers most of the ground we need Lerna for
- [pnpm Workspaces](https://pnpm.js.org/en/workspaces)
- [Rush](https://rushjs.io/) which takes a more transactional approach and might be suitable if the project is larger

### Why TypeScript?

These days TypeScript is becoming more and more popular - and I think it is inevitable that most code bases that are large enough would need some sort of types.
The main benefit TypeScript to me is that it enforces the contracts between components -
for example, when using a third-party component, it is simple to know what is possible/acceptable and what is not -
which makes fast development, refactoring and migration generally much safer to do and much less painful.

Another benefit it brings (over using traditional JavaScript) is that I can ensure that server API responses will align with how the client is structured (i.e. sharing types).
That way, I don't have to guess whether something awkward can slip through and will generally be more confident about stuff being sound.

It does, on the contrary, slows down the development cycle - mostly because there is a cost for recompilation and type checking.
Here I've used some tools to partially mitigate the problem, but this is unfortunately a price TypeScript projects have to pay.
(Well, Babel is also slow :stuck_out_tongue_winking_eye:)

In this project, I've adopted some of the strictest settings to get the most out of TypeScript (and because I can cope with it :joy_cat:),
but for larger repositories (or when dealing with migrations) it might make sense to relax them a bit to allow a faster iteration speed.
