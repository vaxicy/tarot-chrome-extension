/**
 * Cloudflare Workers - 塔罗牌授权码验证服务器
 * 部署：将代码复制到 Cloudflare Workers 并部署
 * 免费额度：每天 100,000 次请求
 */

// 授权码数据库（实际生产应存到 KV 或 D1 数据库）
// 格式：{ 授权码: { type: 'lifetime'|'yearly', maxDevices: 3, usedDevices: [], note: '' } }
const LICENSES = {
  // 示例授权码（部署前请修改为你自己的授权码）
  'TAROT-DEMO-0001': {
    type: 'lifetime',    // lifetime = 永久, yearly = 年付
    maxDevices: 3,       // 最多绑定设备数
    usedDevices: [],      // 已绑定设备ID列表
    note: '演示授权码',
    createdAt: '2026-01-01'
  },
  'TAROT-PRO-2026': {
    type: 'yearly',
    maxDevices: 1,
    usedDevices: [],
    note: '2026年度授权',
    createdAt: '2026-01-01',
    expireDate: '2027-01-01'  // 年付有固定到期日
  }
};

// 生成简单设备ID（基于浏览器指纹）
function getDeviceFingerprint(request) {
  const ua = request.headers.get('User-Agent') || '';
  const cfIp = request.headers.get('CF-Connecting-IP') || '';
  // 简单哈希（生产环境建议用更可靠的设备指纹）
  return btoa(ua.substring(0, 50) + cfIp).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

// 验证授权码
async function verifyLicense(code, deviceId, env) {
  // 从 KV 存储读取（如果配置了 KV）
  // let licenseData = await env.TAROT_LICENSES.get(code, 'json');
  
  // 暂时从内存读取（Workers 每次请求会重置，生产环境必须用 KV）
  const licenseData = LICENSES[code];
  
  if (!licenseData) {
    return { valid: false, error: '无效的授权码' };
  }
  
  // 检查设备绑定
  const isDeviceBound = licenseData.usedDevices.includes(deviceId);
  
  if (!isDeviceBound) {
    // 新设备，检查是否超过限制
    if (licenseData.usedDevices.length >= licenseData.maxDevices) {
      return { 
        valid: false, 
        error: `授权码已绑定 ${licenseData.maxDevices} 台设备，请先在旧设备中解绑` 
      };
    }
    // 绑定新设备
    licenseData.usedDevices.push(deviceId);
    // 这里应该保存到 KV：await env.TAROT_LICENSES.put(code, JSON.stringify(licenseData));
  }
  
  // 计算到期时间
  let expireDate = null;
  if (licenseData.type === 'yearly') {
    if (licenseData.expireDate) {
      expireDate = new Date(licenseData.expireDate).getTime();
    } else {
      expireDate = Date.now() + 365 * 86400 * 1000;  // 一年后
    }
    
    // 检查是否过期
    if (Date.now() > expireDate) {
      return { valid: false, error: '授权已过期，请续费' };
    }
  }
  
  return {
    valid: true,
    type: licenseData.type,
    expireDate: expireDate,
    deviceId: deviceId,
    note: licenseData.note
  };
}

// 解绑设备（可选功能）
async function unbindDevice(code, deviceId) {
  const licenseData = LICENSES[code];
  if (!licenseData) {
    return { success: false, error: '无效的授权码' };
  }
  
  const idx = licenseData.usedDevices.indexOf(deviceId);
  if (idx === -1) {
    return { success: false, error: '该设备未绑定此授权码' };
  }
  
  licenseData.usedDevices.splice(idx, 1);
  return { success: true, message: '设备已解绑' };
}

// 主处理函数
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS 头（允许扩展请求）
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // 路由处理
    if (path === '/verify' && request.method === 'GET') {
      // 验证授权码
      const code = url.searchParams.get('code');
      const deviceId = url.searchParams.get('deviceId') || 'unknown';
      
      if (!code) {
        return new Response(JSON.stringify({ valid: false, error: '缺少授权码' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const result = await verifyLicense(code, deviceId, env);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/unbind' && request.method === 'POST') {
      // 解绑设备
      const body = await request.json();
      const { code, deviceId } = body;
      
      const result = await unbindDevice(code, deviceId);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/generate' && request.method === 'POST') {
      // 生成新授权码（管理员功能，应该加密码保护）
      const body = await request.json();
      const { adminKey, code, type, maxDevices } = body;
      
      // 简单管理员验证（生产环境用更强的认证）
      if (adminKey !== 'Tarot@Admin#2026!X9mKpQwL') {
        return new Response(JSON.stringify({ success: false, error: '无权限' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        });
      }
      
      LICENSES[code] = {
        type: type || 'lifetime',
        maxDevices: maxDevices || 3,
        usedDevices: [],
        note: body.note || '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      return new Response(JSON.stringify({ success: true, message: '授权码已生成' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/check' && request.method === 'GET') {
      // 检查授权状态（用于扩展启动时验证）
      const code = url.searchParams.get('code');
      const deviceId = url.searchParams.get('deviceId') || 'unknown';
      
      if (!code) {
        return new Response(JSON.stringify({ valid: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const licenseData = LICENSES[code];
      if (!licenseData) {
        return new Response(JSON.stringify({ valid: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // 检查设备是否绑定
      if (!licenseData.usedDevices.includes(deviceId)) {
        return new Response(JSON.stringify({ valid: false, error: '设备未绑定' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // 检查年付是否过期
      if (licenseData.type === 'yearly' && licenseData.expireDate) {
        if (Date.now() > new Date(licenseData.expireDate).getTime()) {
          return new Response(JSON.stringify({ valid: false, error: '授权已过期' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
      
      return new Response(JSON.stringify({
        valid: true,
        type: licenseData.type,
        expireDate: licenseData.expireDate || null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else {
      // 主页（可用于状态监控）
      return new Response(JSON.stringify({
        name: 'Tarot License Server',
        version: '1.0',
        status: 'running',
        endpoints: ['/verify', '/check', '/unbind']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
