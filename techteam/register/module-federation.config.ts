import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'register',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;
