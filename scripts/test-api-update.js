#!/usr/bin/env node

/**
 * Script test để cập nhật dữ liệu phường từ Goong API
 * Test với một vài phường trước khi chạy toàn bộ
 */

const fs = require('fs');
const path = require('path');

// Configuration
const GOONG_API_KEY = 'sVaACBVHw2KeYaL8C5BvH3fvM20S7LLX6V57plr';
const BASE_URL = 'https://rsapi.goong.io';

/**
 * Gọi Goong API để tìm kiếm địa điểm
 */
async function searchPlaces(query) {
  const params = new URLSearchParams({
    input: query,
    location: '10.7552929,106.3655765', // HCMC coordinates
    limit: 10,
    api_key: GOONG_API_KEY,
    has_deprecated_administrative_unit: 'true'
  });

  try {
    const response = await fetch(`${BASE_URL}/v2/place/autocomplete?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error searching for "${query}":`, error.message);
    return null;
  }
}

/**
 * Test với một số phường cụ thể
 */
async function testWards() {
  const testWards = [
    'Phường Diên Hồng',
    'Phường Sài Gòn',
    'Phường Tân Định',
    'Phường Bến Thành'
  ];

'🧪 Testing Goong API with sample wards...\n');

  for (const wardName of testWards) {
`🔍 Searching for: ${wardName}`);
    
    try {
      const data = await searchPlaces(wardName);
      
      if (data && data.status === 'OK' && data.predictions) {
`  ✅ Found ${data.predictions.length} results:`);
        
        data.predictions.forEach((prediction, index) => {
          if (prediction.description && 
              prediction.description.toLowerCase().includes('hồ chí minh')) {
            
`    ${index + 1}. ${prediction.description}`);
`       Place ID: ${prediction.place_id}`);
`       Types: ${prediction.types?.join(', ') || 'N/A'}`);
            
            // Check for deprecated info
            if (prediction.description.includes('cũ') || 
                prediction.description.includes('sáp nhập') ||
                prediction.description.includes('hợp thành')) {
`       🏢 Contains old district info: YES`);
            }
          }
        });
      } else {
`  ❌ No results found`);
      }
    } catch (error) {
`  ❌ Error: ${error.message}`);
    }
    
''); // Empty line for readability
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

/**
 * Test với tìm kiếm quận
 */
async function testDistricts() {
  const testDistricts = [
    'Quận 10',
    'Quận 6',
    'Quận 8',
    'Quận Thủ Đức'
  ];

'🏢 Testing Goong API with sample districts...\n');

  for (const districtName of testDistricts) {
`🔍 Searching for: ${districtName}`);
    
    try {
      const data = await searchPlaces(districtName);
      
      if (data && data.status === 'OK' && data.predictions) {
`  ✅ Found ${data.predictions.length} results:`);
        
        data.predictions.forEach((prediction, index) => {
          if (prediction.description && 
              prediction.description.toLowerCase().includes('hồ chí minh')) {
            
`    ${index + 1}. ${prediction.description}`);
`       Place ID: ${prediction.place_id}`);
`       Types: ${prediction.types?.join(', ') || 'N/A'}`);
            
            // Check if it's district level
            if (prediction.types?.includes('administrative_area_level_2')) {
`       🏢 District level: YES`);
            }
          }
        });
      } else {
`  ❌ No results found`);
      }
    } catch (error) {
`  ❌ Error: ${error.message}`);
    }
    
''); // Empty line for readability
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

/**
 * Main function
 */
async function main() {
'🚀 Starting Goong API test...\n');
  
  await testWards();
  await testDistricts();
  
'✅ Test completed!');
'\n📝 Next steps:');
'1. Review the results above');
'2. If results look good, run the full update script:');
'   node scripts/update-wards-data.js');
'3. The full script will update all wards in your JSON file');
}

// Chạy test
if (require.main === module) {
  main().catch(console.error);
}
