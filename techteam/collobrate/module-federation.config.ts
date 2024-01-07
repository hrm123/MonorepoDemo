import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'collobrate',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;
