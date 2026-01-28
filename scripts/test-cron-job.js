#!/usr/bin/env node

/**
 * Test script to verify the analytics aggregation cron job endpoint
 * This helps debug authentication issues with external cron services
 */

const https = require('https');
const http = require('http');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const ANALYTICS_SECRET = process.env.ANALYTICS_CRON_SECRET;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`\n${colors.bold}${colors.blue}🧪 Testing Analytics Cron Job Endpoint${colors.reset}\n`);

// Test configuration
const testCases = [
  {
    name: 'Production HTTPS with correct auth',
    url: 'https://it-wala.com/api/analytics/aggregate',
    useAuth: true,
    method: 'POST'
  },
  {
    name: 'Production HTTPS without auth (should fail)',
    url: 'https://it-wala.com/api/analytics/aggregate',
    useAuth: false,
    method: 'POST'
  },
  {
    name: 'Production HTTP (should redirect to HTTPS)',
    url: 'http://it-wala.com/api/analytics/aggregate',
    useAuth: true,
    method: 'POST'
  },
  {
    name: 'Local development with auth',
    url: 'http://localhost:3000/api/analytics/aggregate',
    useAuth: true,
    method: 'POST'
  }
];

// Check if secret is configured
console.log(`${colors.bold}Configuration:${colors.reset}`);
console.log(`   ANALYTICS_CRON_SECRET: ${ANALYTICS_SECRET ? colors.green + '✓ Set' + colors.reset : colors.red + '✗ Not set' + colors.reset}`);
if (ANALYTICS_SECRET) {
  console.log(`   Secret format: Bearer ${ANALYTICS_SECRET.substring(0, 10)}...${ANALYTICS_SECRET.substring(ANALYTICS_SECRET.length - 10)}`);
}
console.log('');

// Function to make HTTP/HTTPS request
function makeRequest(testCase) {
  return new Promise((resolve) => {
    const url = new URL(testCase.url);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const headers = {
      'Content-Type': 'application/json'
    };

    if (testCase.useAuth && ANALYTICS_SECRET) {
      headers['Authorization'] = `Bearer ${ANALYTICS_SECRET}`;
    }

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: testCase.method,
      headers: headers
    };

    console.log(`${colors.bold}Test: ${testCase.name}${colors.reset}`);
    console.log(`   URL: ${testCase.url}`);
    console.log(`   Method: ${testCase.method}`);
    console.log(`   Auth Header: ${testCase.useAuth && ANALYTICS_SECRET ? 'Bearer [SECRET]' : 'None'}`);

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const statusColor = res.statusCode >= 200 && res.statusCode < 300 ? colors.green :
                           res.statusCode >= 300 && res.statusCode < 400 ? colors.yellow :
                           colors.red;

        console.log(`   ${statusColor}Status: ${res.statusCode} ${res.statusMessage}${colors.reset}`);

        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`   ${colors.yellow}Redirect to: ${res.headers.location}${colors.reset}`);
        }

        try {
          const jsonData = JSON.parse(data);
          console.log(`   Response:`, JSON.stringify(jsonData, null, 2).split('\n').map(line => '      ' + line).join('\n').trim());
        } catch (e) {
          if (data) {
            console.log(`   Response: ${data.substring(0, 200)}`);
          }
        }

        console.log('');
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.log(`   ${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
      resolve({ error: error.message });
    });

    // Send request body
    if (testCase.method === 'POST') {
      req.write(JSON.stringify({}));
    }

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log(`${colors.bold}Running Tests...${colors.reset}\n`);

  for (const testCase of testCases) {
    await makeRequest(testCase);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`${colors.bold}${colors.blue}Test Summary${colors.reset}`);
  console.log(`${colors.bold}For cron-job.org configuration:${colors.reset}`);
  console.log(`   1. URL: ${colors.green}https://it-wala.com/api/analytics/aggregate${colors.reset}`);
  console.log(`   2. Method: ${colors.green}POST${colors.reset}`);
  console.log(`   3. Headers:`);
  console.log(`      - Name: ${colors.green}Authorization${colors.reset}`);
  console.log(`      - Value: ${colors.green}Bearer ${ANALYTICS_SECRET}${colors.reset}`);
  console.log(`   4. Request Body: ${colors.green}{}${colors.reset} (empty JSON object)\n`);
}

runTests().catch(console.error);
