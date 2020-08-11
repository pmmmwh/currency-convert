# @currency-convert/client

The front-end for the currency convert application.

## Development

To work on the project, you will first need a `.env` file.

```dotenv
API_DOMAIN="<Full URL where @currency-convert/server is running>"
# e.g. http://localhost:3001
```

Then, simply run the following command:

```sh
yarn dev
```

It will spin up a [Webpack](https://webpack.js.org) development server locally,
with Hot Module Replacement (via React Fast Refresh) enabled.

You can visit http://localhost:3000 to start development.

## Production

You can create a production build of the project via the following command:

```sh
yarn build
```

The built files will be located at the `build` folder.

If you also want to verify the build and see the results:

```sh
yarn start
```

It will spin up a resource server pointing at the built artifacts via http://localhost:3000.
