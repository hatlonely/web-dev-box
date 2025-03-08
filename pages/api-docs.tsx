import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ApiDocs: React.FC = () => {
  return (
    <div>
      <Head>
        <title>API 文档 - Web Dev Box</title>
        <meta name="description" content="Web Dev Box API 文档" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>API 文档</h1>
        <p>
          <Link href="/">
            <a>← 返回首页</a>
          </Link>
        </p>

        <section style={{ marginTop: '40px' }}>
          <h2>域名查询 API</h2>
          <p>
            <code>/api/domain-info</code> 端点允许您查询域名的 WHOIS 信息和 DNS 记录。
          </p>

          <h3>请求</h3>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
            GET /api/domain-info?domain=example.com
          </pre>

          <h3>参数</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>参数</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>类型</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px' }}>domain</td>
                <td style={{ padding: '8px' }}>string</td>
                <td style={{ padding: '8px' }}>要查询的域名，例如 example.com</td>
              </tr>
            </tbody>
          </table>

          <h3>响应</h3>
          <p>响应是一个 JSON 对象，包含以下字段：</p>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`{
  "whoisInfo": [
    {
      "key": "1",
      "field": "域名",
      "value": "example.com",
      "description": "查询的域名"
    },
    // 更多 WHOIS 信息...
  ],
  "dnsRecords": [
    {
      "key": "a-0",
      "type": "A",
      "name": "example.com",
      "value": "93.184.216.34",
      "ttl": "86400"
    },
    // 更多 DNS 记录...
  ]
}`}
          </pre>

          <h3>错误</h3>
          <p>如果发生错误，响应将包含一个 error 字段：</p>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
{`{
  "whoisInfo": [],
  "dnsRecords": [],
  "error": "请提供有效的域名"
}`}
          </pre>

          <h3>示例</h3>
          <p>
            <a href="/api/domain-info?domain=example.com" target="_blank" rel="noopener noreferrer">
              尝试查询 example.com
            </a>
          </p>
          <p>
            <a href="/api/domain-info?domain=google.com" target="_blank" rel="noopener noreferrer">
              尝试查询 google.com
            </a>
          </p>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h2>服务端渲染优势</h2>
          <p>
            使用 Next.js 的服务端渲染技术，我们可以在服务器端执行域名查询，从而突破浏览器的跨域限制。
            这带来了以下优势：
          </p>
          <ul>
            <li>无跨域限制：服务器可以直接请求任何域名的信息，不受浏览器同源策略限制</li>
            <li>更高效的查询：服务器可以直接使用 DNS 和 WHOIS 协议查询，而不需要依赖第三方 API</li>
            <li>更好的性能：减少客户端的网络请求，提高查询速度</li>
            <li>API 密钥保护：敏感的 API 密钥可以只存在于服务器，不会暴露给客户端</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ApiDocs;
