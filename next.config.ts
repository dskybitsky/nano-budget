import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // camel-case style names from css modules
    config.module.rules
      // @ts-expect-error webpack 'any' type error
      .find(({oneOf}) => !!oneOf).oneOf
      // @ts-expect-error webpack 'any' type error
      .filter(({use}) => JSON.stringify(use)?.includes('css-loader'))
      // @ts-expect-error webpack 'any' type error
      .reduce((acc, {use}) => acc.concat(use), [])
      // @ts-expect-error webpack 'any' type error
      .forEach(({options}) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
