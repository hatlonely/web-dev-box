/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许跨域请求和设置内容安全策略
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
      {
        // 为所有页面添加内容安全策略
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*; font-src 'self'; object-src 'none'; media-src 'self'; child-src 'self'; frame-src 'self'; worker-src 'self' blob:; manifest-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'self'"
          },
          {
            key: 'Permissions-Policy',
            value: 'clipboard-write=self'
          }
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
