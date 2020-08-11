module.exports = (api) => {
  // This caches the Babel config according to NODE_ENV
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          // Enable Babel browser patches (aligns browser behaviour)
          bugfixes: true,
          // Only target modern browsers (i.e. ES2017+)
          targets: {
            esmodules: true,
          },
        },
      ],
      [
        '@babel/preset-react',
        {
          // Enable development transforms for non-production modes,
          // e.g. __self and __source JSX transforms.
          development: !api.env('production'),
        },
      ],
      [
        '@babel/preset-typescript',
        {
          // Tell Babel to only tree-shake `import type` imports  (TS 3.8+).
          // This is to prevent Babel from shaking ambiguous side-effect imports.
          onlyRemoveTypeImports: true,
        },
      ],
    ],
    plugins: [
      // Applies the react-refresh Babel plugin in non-production modes only
      !api.env('production') && 'react-refresh/babel',
      // Reuse Babel runtime helpers to save bundle size
      [
        '@babel/plugin-transform-runtime',
        {
          // Use core-js 3 since v2 is unmaintained now
          corejs: 3,
          // Enable regenerator helpers to prevent polluting global scope
          regenerator: true,
          // Use ESM helper files
          useESModules: true,
        },
      ],
      // Optimise material-ui imports to allow root named imports for ergonomics
      [
        'babel-plugin-transform-imports',
        {
          '@material-ui/core': {
            preventFullImport: true,
            transform: '@material-ui/core/esm/${member}',
          },
          '@material-ui/icons': {
            preventFullImport: true,
            transform: '@material-ui/icons/esm/${member}',
          },
          '@material-ui/lab': {
            preventFullImport: true,
            transform: '@material-ui/lab/esm/${member}',
          },
        },
      ],
    ].filter(Boolean),
  };
};
