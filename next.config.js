/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        serverActions: true,
    },
    async rewrites() {
        return [
            {
                source: '/institute/:path*',
                destination: `${process.env.NEXTAUTH_BASE_URL}/institute/:path*`,
            },
        ];
    },
    // webpack: (config) => {
    //     config.module.rules.push({
    //         test: /\.node/,
    //         use: 'raw-loader',
    //     });

    //     return config;
    // },
}

module.exports = nextConfig
