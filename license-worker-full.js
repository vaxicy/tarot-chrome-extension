/**
 * Cloudflare Workers - 塔罗牌授权码验证服务器
 * 部署：将代码复制到 Cloudflare Workers 并部署
 * 免费额度：每天 100,000 次请求
 */

// 授权码数据库（实际生产应存到 KV 或 D1 数据库）
// 格式：{ 授权码: { type: 'lifetime'|'yearly', maxDevices: 3, usedDevices: [], note: '' } }
const LICENSES = {
  // ========== 正式授权码（100个）==========
  'TAROT-4JKU-HPJG-DVEY-9J2C': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-H72M-BWKR-X2CD-GVHC': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-6U88-FDRL-QZM2-U8ZN': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-UPQX-FSA9-H2PP-FBN7': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-2FTF-XXK9-VPZV-HSW4': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-WPKS-8WX4-LVMT-GBAH': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-S26N-FGM2-LUPM-MQCB': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-ZJG2-GTYP-PUF2-836U': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-YAHP-UWAK-32TC-DL4V': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-3UT5-W9X5-KCUL-T47T': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-VBEN-X4MJ-HG95-CNG7': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-MSFF-SCLC-8U4U-MRJK': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-RQ82-6X5Y-3ZM7-D8LW': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-QF5Y-MZ52-7CJM-N53K': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-JF3D-UBNK-KN9F-3L9H': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-BXFN-SDFP-HC8Z-UZPA': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-KV5W-BW7S-5T7K-MMNW': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-UKR9-GTVX-SLKP-LNPV': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-73GG-XRPZ-C2R3-DF7Z': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-B2WG-UK7Z-2W6S-A9AT': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-623M-CPCC-4WKY-3XFA': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-6952-MVBY-UYZS-J8A5': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-ZHVE-SKHZ-NXS4-9LR4': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-246Z-XYH4-9UBW-NF4P': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-YL7K-266S-6ASE-6V6D': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-YZEF-A727-69EA-6ZL7': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-FJFL-8QUZ-ASR6-CVS6': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-ZM5W-SE7M-75GR-GWJ5': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-A9UM-CL7Z-FYHF-AHE5': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-XB2S-7RBD-ATV3-DH5G': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-9Y86-LKYD-2BFL-WJF4': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-DG46-QHCT-9R28-9464': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-QB5N-EQSE-E4KV-CEN4': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-RVZX-GH5X-E738-TBA2': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-Z7TB-SQDA-QEDH-9ZFZ': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-VWCZ-QGWR-KUVL-B95V': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-D4WM-89X4-V2P6-55XE': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-54AU-FBJD-8EC4-G4K3': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-27UE-ND2Z-UWUJ-G2P5': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-WULJ-KRXM-CAAY-MXK2': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-8LEP-YRPD-TNDR-ZFUK': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-4M74-AM8S-2H67-E3W5': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-DR9K-TAY9-UVPM-M29N': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-QDKL-SZAU-STFP-AR36': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-EJHJ-3S86-C99T-T5LJ': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-MENW-NN7V-6SJE-KGTT': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-RYRD-W4W5-8QJ8-NHX3': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-V67M-3VE9-P7FK-TMXN': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-KERP-F4R4-MXGW-RTPQ': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-LN8E-3T2T-7CMZ-UKSF': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-FAUV-YS27-FYM6-VMLG': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-HYP5-33QF-GKX8-MBUV': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-TTYR-V4JD-MMMQ-4CGB': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-434Z-J2BH-N26G-MHCF': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-R9B8-EPYD-PBKA-B5WK': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-ATAU-9SPG-23YQ-EE6F': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-MGNX-ZCG5-FD7Q-GPLR': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-V534-3WJC-G68L-23ZX': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-D4ST-54XZ-Q2CA-W6A6': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-7QKM-C6SP-C4VL-PRCF': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-EJTV-CSMG-5AJZ-8H9W': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-TZWP-YX3W-5F4E-37X5': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-6NSP-P4NR-X3V5-4UD4': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-ZNEN-ZDUX-ZBDV-SXMK': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-GBD6-UAPW-UFHW-2MRK': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-79Q9-8HPB-LZE7-8M3D': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-3GTH-8Q5E-HL5B-QF63': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-2PFS-BR94-GEZD-6LSP': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-8X2W-76TB-S3YG-PKNS': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-ZLMD-9NCH-Q6GD-BB68': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-2AWB-TECX-T7SV-VEHW': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-TQCJ-2WXP-KPT6-V3MV': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-NGBC-QPEC-8673-VS9W': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-VKPV-4WY7-VG55-EGKM': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-X4QU-LXLU-3GAJ-UGXV': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-SSBA-52XB-9SRA-9LSW': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-W6QY-V2Z5-DNCZ-538J': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-WUBH-DRNW-9F7Y-8S7B': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-R5SS-67YU-7SHF-SEXX': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-FEAT-Q6XZ-WEQD-D3G8': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-HCBD-N34V-972M-3TKS': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-4PNX-Q357-RH9R-UWRQ': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-KKBF-88D6-4S62-QWU7': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-L5X3-6M9V-PBFT-QAVM': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-AWG6-LKFR-7DNF-DV7F': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-3LEP-V4BA-DHM7-38SR': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-D65L-CJB4-K33L-GKRE': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-2MNY-FYLY-35KB-SLHF': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-CMSB-2JVQ-RSJ4-JUN3': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-UE93-M37K-9SS4-6EXW': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-4LFW-W4KN-UJG4-GENA': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-KNLW-EPKB-6B6Q-GJ5L': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-9P5Q-GL24-EZJJ-2JVE': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-BRBA-ZR54-NW8B-ELHG': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-93XX-GGZQ-VVUH-AZ4N': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-EY8A-W9DV-P8Z3-8JAQ': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-WERQ-YYY4-H9J3-WUXR': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-YPBN-KTNF-9XDL-SJ4T': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-WKBT-GFEF-WU8R-9CPV': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' },
  'TAROT-CUSA-FPR4-F5GD-T9TR': { type: 'lifetime', maxDevices: 3, usedDevices: [], note: '正式授权', createdAt: '2026-06-01' }
};

// 生成简单设备ID（基于浏览器指纹）
function getDeviceFingerprint(request) {
  const ua = request.headers.get('User-Agent') || '';
  const cfIp = request.headers.get('CF-Connecting-IP') || '';
  return btoa(ua.substring(0, 50) + cfIp).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

// 验证授权码
async function verifyLicense(code, deviceId, env) {
  const licenseData = LICENSES[code];
  
  if (!licenseData) {
    return { valid: false, error: '无效的授权码' };
  }
  
  const isDeviceBound = licenseData.usedDevices.includes(deviceId);
  
  if (!isDeviceBound) {
    if (licenseData.usedDevices.length >= licenseData.maxDevices) {
      return { 
        valid: false, 
        error: `授权码已绑定 ${licenseData.maxDevices} 台设备，请先在旧设备中解绑` 
      };
    }
    licenseData.usedDevices.push(deviceId);
  }
  
  let expireDate = null;
  if (licenseData.type === 'yearly') {
    if (licenseData.expireDate) {
      expireDate = new Date(licenseData.expireDate).getTime();
    } else {
      expireDate = Date.now() + 365 * 86400 * 1000;
    }
    
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

// 解绑设备
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
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (path === '/verify' && request.method === 'GET') {
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
      const body = await request.json();
      const { code, deviceId } = body;
      
      const result = await unbindDevice(code, deviceId);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/generate' && request.method === 'POST') {
      const body = await request.json();
      const { adminKey, code, type, maxDevices } = body;
      
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
      
      if (!licenseData.usedDevices.includes(deviceId)) {
        return new Response(JSON.stringify({ valid: false, error: '设备未绑定' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
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
      return new Response(JSON.stringify({
        name: 'Tarot License Server',
        version: '1.0',
        status: 'running',
        totalLicenses: Object.keys(LICENSES).length,
        endpoints: ['/verify', '/check', '/unbind', '/generate']
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
