# Currency Convert

This is a monorepo for all things related to the currency convert application.

## Development

This repository is managed using [Lerna](https://lerna.js.org) via [Yarn v1](https://classic.yarnpkg.com) workspaces.

To get things started, run the following command:

```sh
yarn bootstrap
```

It will tell Lerna to install project dependencies and link up all services.

You can then start development on the separate services of the project, either by moving into its directory:

```sh
cd services/<service-name>
yarn dev
```

Or, alternatively, starting at root:

```sh
yarn workspace @currency-convert/<service-name> dev
```

You can also start working on both the client and the server:

```sh
yarn lerna run --parallel dev
```

### Dependencies

You can add dependencies to each services' `package.json` as if they are not in a monorepo.

However, if you're adding `devDependencies`, Lerna suggests hoisting them at the monorepo's root for consistency.
You can do that by installing the dependency first, then run the following command at monorepo root:

```sh
yarn convert
```

### Code Formatting

This project adopts [Prettier](https://prettier.io) as the primary code formatter.
You can format all code by running:

```sh
yarn format
```

### Type Checking

This project is written in full [TypeScript](https://www.typescriptlang.org).
You can type-check all code by running:

```sh
yarn type-check
```

It will spawn up separate instances of the TypeScript compiler in all services and check for any errors in parallel.

## Documentation

For more information about the project, you can read the [documentation](./docs).
