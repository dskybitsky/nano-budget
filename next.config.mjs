import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    publicRuntimeConfig: {
        version: process.env.npm_package_version,
    },
};

export default withNextIntl(nextConfig);
