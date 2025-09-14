#!/usr/bin/env node

/**
 * Script để test API key và endpoint
 */

// Test với API key hiện tại
const CURRENT_API_KEY = 'sVaACBVHw2KeYaL8C5BvH3fvM20S7LLX6V57plr';

async function testApiKey(apiKey, keyName) {
  
  const testUrl = `https://rsapi.goong.io/v2/place/autocomplete?input=Diên Hồng&location=10.7552929,106.3655765&limit=5&api_key=${apiKey}&has_deprecated_administrative_unit=true`;
  
  try {
    const response = await fetch(testUrl);
    
    
    if (response.ok) {
      const data = await response.json();
    } else {
      const errorText = await response.text();
    }
  } catch (error) {
  }
}

async function main() {
  
  // Test API key hiện tại
  await testApiKey(CURRENT_API_KEY, 'Current API Key');
  
}

main().catch(console.error);
