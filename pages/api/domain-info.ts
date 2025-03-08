import { NextApiRequest, NextApiResponse } from 'next';
import dns from 'dns';
import { promisify } from 'util';

// 将 DNS 查询方法转换为 Promise 版本
const resolveMx = promisify(dns.resolveMx);
const resolveNs = promisify(dns.resolveNs);
const resolveTxt = promisify(dns.resolveTxt);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveCname = promisify(dns.resolveCname);
const resolveSoa = promisify(dns.resolveSoa);

interface DomainInfo {
  key: string;
  field: string;
  value: string;
  description: string;
}

interface DnsRecord {
  key: string;
  type: string;
  name: string;
  value: string;
  ttl: string;
}

interface DomainQueryResult {
  whoisInfo: DomainInfo[];
  dnsRecords: DnsRecord[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DomainQueryResult>
) {
  const { domain } = req.query;

  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({
      whoisInfo: [],
      dnsRecords: [],
      error: '请提供有效的域名',
    });
  }

  try {
    // 并行获取 WHOIS 和 DNS 信息
    const [whoisInfo, dnsRecords] = await Promise.all([
      fetchWhoisInfo(domain),
      fetchDnsRecords(domain),
    ]);

    return res.status(200).json({
      whoisInfo,
      dnsRecords,
    });
  } catch (error) {
    console.error('域名查询失败:', error);
    return res.status(500).json({
      whoisInfo: [],
      dnsRecords: [],
      error: '域名查询失败，请稍后重试',
    });
  }
}

// 获取域名的 WHOIS 信息
async function fetchWhoisInfo(domain: string): Promise<DomainInfo[]> {
  try {
    // 在服务端，我们可以使用 whois 库来查询 WHOIS 信息
    // 但由于这里是示例，我们模拟一些基本信息

    // 在实际项目中，你可以安装 whois 库：
    // npm install whois
    // 然后使用它来查询真实的 WHOIS 信息

    // 模拟 WHOIS 信息 - 只包含用户关心的域名信息
    const info: DomainInfo[] = [
      {
        key: '1',
        field: '域名',
        value: domain,
        description: '查询的域名'
      },
      {
        key: '2',
        field: '注册商',
        value: '获取失败',
        description: '域名注册服务商'
      },
      {
        key: '3',
        field: '注册日期',
        value: '获取失败',
        description: '域名创建日期'
      },
      {
        key: '4',
        field: '到期日期',
        value: '获取失败',
        description: '域名到期日期'
      },
      {
        key: '5',
        field: '状态',
        value: '获取失败',
        description: '域名状态'
      }
    ];

    return info;
  } catch (error) {
    console.error('获取 WHOIS 信息失败:', error);
    return [];
  }
}

// 获取域名的 DNS 记录
async function fetchDnsRecords(domain: string): Promise<DnsRecord[]> {
  try {
    const records: DnsRecord[] = [];

    // 使用 Node.js 的 DNS 模块查询各种 DNS 记录
    // 这里我们尝试查询各种类型的记录，如果出错则忽略

    // 查询 A 记录 (IPv4)
    try {
      const aRecords = await resolve4(domain);
      aRecords.forEach((ip, index) => {
        records.push({
          key: `a-${index}`,
          type: 'A',
          name: domain,
          value: ip,
          ttl: '-'
        });
      });
    } catch (e) {
      // 忽略错误，可能没有 A 记录
    }

    // 查询 AAAA 记录 (IPv6)
    try {
      const aaaaRecords = await resolve6(domain);
      aaaaRecords.forEach((ip, index) => {
        records.push({
          key: `aaaa-${index}`,
          type: 'AAAA',
          name: domain,
          value: ip,
          ttl: '-'
        });
      });
    } catch (e) {
      // 忽略错误，可能没有 AAAA 记录
    }

    // 查询 MX 记录
    try {
      const mxRecords = await resolveMx(domain);
      mxRecords.forEach((record, index) => {
        records.push({
          key: `mx-${index}`,
          type: 'MX',
          name: domain,
          value: `${record.priority} ${record.exchange}`,
          ttl: '-'
        });
      });
    } catch (e) {
      // 忽略错误，可能没有 MX 记录
    }

    // 查询 NS 记录
    try {
      const nsRecords = await resolveNs(domain);
      nsRecords.forEach((ns, index) => {
        records.push({
          key: `ns-${index}`,
          type: 'NS',
          name: domain,
          value: ns,
          ttl: '-'
        });
      });
    } catch (e) {
      // 忽略错误，可能没有 NS 记录
    }

    // 查询 TXT 记录
    try {
      const txtRecords = await resolveTxt(domain);
      txtRecords.forEach((txt, index) => {
        records.push({
          key: `txt-${index}`,
          type: 'TXT',
          name: domain,
          value: txt.join(' '),
          ttl: '-'
        });
      });
    } catch (e) {
      // 忽略错误，可能没有 TXT 记录
    }

    // 查询 CNAME 记录
    try {
      const cnameRecords = await resolveCname(domain);
      cnameRecords.forEach((cname, index) => {
        records.push({
          key: `cname-${index}`,
          type: 'CNAME',
          name: domain,
          value: cname,
          ttl: '-'
        });
      });
    } catch (e) {
      // 忽略错误，可能没有 CNAME 记录
    }

    // 查询 SOA 记录
    try {
      const soaRecord = await resolveSoa(domain);
      records.push({
        key: 'soa-0',
        type: 'SOA',
        name: domain,
        value: `${soaRecord.nsname} ${soaRecord.hostmaster}`,
        ttl: soaRecord.serial.toString()
      });
    } catch (e) {
      // 忽略错误，可能没有 SOA 记录
    }

    // 如果没有找到任何记录，添加一条说明
    if (records.length === 0) {
      records.push({
        key: 'info-0',
        type: '信息',
        name: domain,
        value: '未找到任何 DNS 记录',
        ttl: '-'
      });
    }

    // 不再添加关于实现方式的说明

    return records;
  } catch (error) {
    console.error('获取 DNS 记录失败:', error);
    return [{
      key: 'error-0',
      type: '错误',
      name: domain,
      value: '获取 DNS 记录失败',
      ttl: '-'
    }];
  }
}
