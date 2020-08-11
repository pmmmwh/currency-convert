# @currency-convert/server

The API server for the currency convert application.

## Development

To work on the project, you will first need a `.env` file.

```dotenv
ACCESS_KEY="<A Fixer.io access key>"
SECRET_KEY="<A 256-bit secret key for JWT issuing>"
```

Then, simply run the following command:

```sh
yarn dev
```

It will spin up a server (via [ts-node-dev](https://github.com/whitecolor/ts-node-dev)) locally with file watchers,
which will automatically restart when changes happen in relevant files.

The server by default will run on http://localhost:3001.

## Production

You can create the production build via the following command:

```sh
yarn build
```

The built files will be located at the `build` folder.

If you also want to verify the build and see the results:

```sh
yarn start
```

It will spin up the API server at http://localhost:3001.
