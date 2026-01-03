import { NextApiRequest, NextApiResponse } from 'next';

// Country code to name mapping
const COUNTRY_CODE_MAP: { [key: string]: string } = {
  'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'UK': 'United Kingdom',
  'FR': 'France', 'DE': 'Germany', 'IT': 'Italy', 'ES': 'Spain', 'NL': 'Netherlands',
  'BE': 'Belgium', 'AT': 'Austria', 'CH': 'Switzerland', 'SE': 'Sweden', 'NO': 'Norway',
  'DK': 'Denmark', 'FI': 'Finland', 'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary',
  'RO': 'Romania', 'BG': 'Bulgaria', 'GR': 'Greece', 'TR': 'Turkey', 'RU': 'Russia',
  'UA': 'Ukraine', 'IE': 'Ireland', 'PT': 'Portugal', 'JP': 'Japan', 'CN': 'China',
  'KR': 'South Korea', 'TW': 'Taiwan', 'HK': 'Hong Kong', 'SG': 'Singapore',
  'TH': 'Thailand', 'ID': 'Indonesia', 'PH': 'Philippines', 'MY': 'Malaysia',
  'VN': 'Vietnam', 'IN': 'India', 'PK': 'Pakistan', 'BD': 'Bangladesh',
  'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia', 'IR': 'Iran', 'IQ': 'Iraq',
  'KW': 'Kuwait', 'QA': 'Qatar', 'BH': 'Bahrain', 'OM': 'Oman', 'UZ': 'Uzbekistan',
  'KZ': 'Kazakhstan', 'IL': 'Israel', 'JO': 'Jordan', 'LB': 'Lebanon', 'SY': 'Syria',
  'EG': 'Egypt', 'NG': 'Nigeria', 'ZA': 'South Africa', 'KE': 'Kenya', 'MA': 'Morocco',
  'TN': 'Tunisia', 'DZ': 'Algeria', 'GH': 'Ghana', 'ET': 'Ethiopia', 'TZ': 'Tanzania',
  'UG': 'Uganda', 'ZW': 'Zimbabwe', 'ZM': 'Zambia', 'BW': 'Botswana', 'MW': 'Malawi',
  'MZ': 'Mozambique', 'AO': 'Angola', 'CM': 'Cameroon', 'CI': 'Ivory Coast', 'SN': 'Senegal',
  'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile', 'PE': 'Peru', 'CO': 'Colombia',
  'VE': 'Venezuela', 'EC': 'Ecuador', 'UY': 'Uruguay', 'PY': 'Paraguay', 'BO': 'Bolivia',
  'MX': 'Mexico', 'GT': 'Guatemala', 'CR': 'Costa Rica', 'PA': 'Panama', 'HN': 'Honduras',
  'NI': 'Nicaragua', 'SV': 'El Salvador', 'BZ': 'Belize', 'JM': 'Jamaica', 'CU': 'Cuba',
  'DO': 'Dominican Republic', 'HT': 'Haiti', 'TT': 'Trinidad and Tobago',
  'AU': 'Australia', 'NZ': 'New Zealand', 'FJ': 'Fiji', 'PG': 'Papua New Guinea',
  'NC': 'New Caledonia', 'VU': 'Vanuatu', 'SB': 'Solomon Islands', 'IS': 'Iceland',
  'GL': 'Greenland', 'FO': 'Faroe Islands'
};

function getCountryNameFromCode(code: string): string {
  return COUNTRY_CODE_MAP[code.toUpperCase()] || 'Unknown';
}

function getClientIP(req: NextApiRequest): string | null {
  // Check various headers that might contain the client IP
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const cfConnectingIP = req.headers['cf-connecting-ip']; // Cloudflare

  if (typeof cfConnectingIP === 'string') {
    return cfConnectingIP;
  }

  if (typeof forwarded === 'string') {
    // x-forwarded-for can be a comma-separated list, get the first one
    return forwarded.split(',')[0].trim();
  }

  if (typeof realIP === 'string') {
    return realIP;
  }

  // Fallback to connection remote address
  return req.socket.remoteAddress || null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientIP = getClientIP(req);

    // If running on localhost or no IP found, return based on headers
    if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1' || clientIP.startsWith('192.168') || clientIP.startsWith('10.')) {
      // Try to get country from Cloudflare headers
      const cfCountry = req.headers['cf-ipcountry'];
      if (cfCountry && typeof cfCountry === 'string' && cfCountry !== 'XX') {
        const countryName = getCountryNameFromCode(cfCountry);
        return res.status(200).json({ country: countryName, source: 'cloudflare-header' });
      }

      return res.status(200).json({ country: 'Unknown', source: 'localhost', ip: clientIP });
    }

    // Method 1: Check Cloudflare headers (if deployed on Vercel/Cloudflare)
    const cfCountry = req.headers['cf-ipcountry'];
    if (cfCountry && typeof cfCountry === 'string' && cfCountry !== 'XX') {
      const countryName = getCountryNameFromCode(cfCountry);
      return res.status(200).json({ country: countryName, source: 'cloudflare-header' });
    }

    // Method 2: Use ipapi.co free API (1000 requests/day, no key needed)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`https://ipapi.co/${clientIP}/json/`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'ITWala-Academy/1.0' }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.country_name && data.country_name !== 'Unknown') {
          return res.status(200).json({
            country: data.country_name,
            source: 'ipapi.co',
            ip: clientIP
          });
        }
      }
    } catch (error) {
      console.warn('ipapi.co lookup failed:', error);
    }

    // Method 3: Use ip-api.com as fallback (45 requests/minute free, no key needed)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`http://ip-api.com/json/${clientIP}?fields=country`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.country && data.country !== 'Unknown') {
          return res.status(200).json({
            country: data.country,
            source: 'ip-api.com',
            ip: clientIP
          });
        }
      }
    } catch (error) {
      console.warn('ip-api.com lookup failed:', error);
    }

    // Fallback: Return Unknown
    return res.status(200).json({
      country: 'Unknown',
      source: 'fallback',
      ip: clientIP
    });

  } catch (error: any) {
    console.error('Country lookup error:', error);
    return res.status(500).json({
      country: 'Unknown',
      error: error.message
    });
  }
}
