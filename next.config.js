/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许跨域请求
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  // 编译 node_modules 中的特定包
  transpilePackages: [
    'antd',
    'rc-util',
    'rc-picker',
    'rc-table',
    'rc-field-form',
    'rc-motion',
    'rc-dropdown',
    'rc-menu',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-select',
    'react-syntax-highlighter'
  ],
};

module.exports = nextConfig;
