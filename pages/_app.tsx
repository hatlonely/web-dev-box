import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from '../components/MainLayout';

// 导入全局样式
import 'antd/dist/reset.css';
import '../styles/index.css';
import '../styles/App.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>开发者工具箱</title>
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ConfigProvider>
  );
}

export default MyApp;
