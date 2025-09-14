#!/usr/bin/env node

/**
 * Script để cập nhật dữ liệu phường/quận từ Goong API
 * Sử dụng API để lấy thông tin chi tiết về các đơn vị hành chính
 */

const fs = require('fs');
const path = require('path');

// Configuration
const GOONG_API_KEY = 'sVaACBVHw2KeYaL8C5BvH3fvM20S7LLX6V57plr';
const BASE_URL = 'https://rsapi.goong.io';
const ENDPOINTS = {
  AUTOCOMPLETE: '/v2/place/autocomplete',
  DETAIL: '/place/detail'
};

// Đọc dữ liệu hiện tại
const currentDataPath = path.join(__dirname, '../src/data/tphcm-wards-complete.json');
const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf8'));

/**
 * Gọi Goong API để tìm kiếm địa điểm
 */
async function searchPlaces(query, options = {}) {
  const params = new URLSearchParams({
    input: query,
    location: options.location || '10.7552929,106.3655765', // HCMC coordinates
    limit: options.limit || 20,
    api_key: GOONG_API_KEY,
    has_deprecated_administrative_unit: 'true'
  });

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.AUTOCOMPLETE}?${params}`);
    
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
 * Lấy chi tiết địa điểm từ place_id
 */
async function getPlaceDetail(placeId) {
  const params = new URLSearchParams({
    place_id: placeId,
    api_key: GOONG_API_KEY
  });

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINTS.DETAIL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error getting details for place_id "${placeId}":`, error.message);
    return null;
  }
}

/**
 * Trích xuất thông tin hành chính từ place data
 */
function extractAdminInfo(place) {
  const district = place.compound?.district || '';
  const commune = place.compound?.commune || '';
  const province = place.compound?.province || '';
  
  // Check for deprecated administrative units
  const deprecatedDistrict = place.deprecated_administrative_unit?.district || '';
  const deprecatedCommune = place.deprecated_administrative_unit?.commune || '';
  
  // Extract merged information from description
  const mergedFrom = place.merged_from || place.formed_from || '';
  const oldWards = [];
  
  // Try to extract old ward information from description
  if (place.description) {
    const wardPatterns = [
      /(?:từ|hợp thành từ|sáp nhập từ)\s*(?:Phường\s*)?(\d+(?:\s*,\s*(?:Phường\s*)?\d+)*)/gi,
      /(?:Phường|phường)\s*(\d+(?:\s*,\s*\d+)*)/gi,
      /(?:^|\s)(\d+(?:\s*,\s*\d+)*)(?:\s|$)/gi,
      /(?:sáp nhập|hợp thành)\s*(?:Phường\s*)?(\d+(?:\s*,\s*(?:Phường\s*)?\d+)*)/gi
    ];
    
    wardPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(place.description)) !== null) {
        if (match[1]) {
          let wardText = match[1].trim();
          wardText = wardText.replace(/Phường\s*/gi, '');
          
          const wards = wardText.split(',').map(w => {
            const cleanWard = w.trim().replace(/\D/g, '');
            return cleanWard;
          }).filter(w => w && w.length > 0);
          
          wards.forEach(ward => {
            if (ward && !oldWards.includes(ward)) {
              oldWards.push(ward);
            }
          });
        }
      }
    });
  }

  // Extract old district information
  const oldDistrictInfo = [];
  if (place.deprecated_administrative_unit) {
    const depAdmin = place.deprecated_administrative_unit;
    if (depAdmin.district) {
      oldDistrictInfo.push({
        district: depAdmin.district,
        commune: depAdmin.commune || '',
        province: depAdmin.province || ''
      });
    }
  }
  
  // Also try to extract from description
  if (oldDistrictInfo.length === 0 && place.description) {
    const oldDistrictPatterns = [
      /(Quận\s+\d+\s+cũ)/gi,
      /(Quận\s+\d+(?:\s*,\s*Quận\s+\d+)*\s+cũ)/gi,
      /(?:của|từ)\s*(Quận\s+\d+(?:\s*,\s*Quận\s+\d+)*)/gi,
      /(Quận\s+\d+(?:\s*,\s*\d+)*\s+cũ)/gi
    ];
    
    oldDistrictPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(place.description)) !== null) {
        if (match[1]) {
          const districtText = match[1].trim();
          const districts = districtText.split(',').map(d => {
            let cleanDistrict = d.trim();
            if (!cleanDistrict.includes('Quận') && !cleanDistrict.includes('cũ')) {
              cleanDistrict = `Quận ${cleanDistrict}`;
            }
            if (!cleanDistrict.includes('cũ')) {
              cleanDistrict = `${cleanDistrict} cũ`;
            }
            return cleanDistrict;
          });
          
          districts.forEach(district => {
            if (!oldDistrictInfo.some(d => d.district === district)) {
              oldDistrictInfo.push({
                district: district,
                commune: '',
                province: 'TP. Hồ Chí Minh'
              });
            }
          });
        }
      }
    });
  }

  return {
    district,
    commune,
    province,
    deprecatedDistrict,
    deprecatedCommune,
    hasDeprecatedUnit: !!(deprecatedDistrict || deprecatedCommune),
    mergedFrom,
    oldWards,
    oldDistrictInfo,
    placeId: place.place_id,
    description: place.description,
    types: place.types || [],
    compound: place.compound || {},
    rawPlace: place
  };
}

/**
 * Cập nhật dữ liệu cho một phường
 */
async function updateWardData(ward, index, total) {
  
  try {
    // Tìm kiếm phường trong Goong API
    const searchQueries = [
      ward.name,
      `${ward.name} TP.HCM`,
      `${ward.name} Hồ Chí Minh`,
      `${ward.name} Phường`
    ];

    let bestMatch = null;
    let bestScore = 0;

    for (const query of searchQueries) {
      const data = await searchPlaces(query);
      
      if (data && data.status === 'OK' && data.predictions) {
        // Tìm kết quả phù hợp nhất
        for (const prediction of data.predictions) {
          if (prediction.description && 
              prediction.description.toLowerCase().includes('hồ chí minh') &&
              prediction.description.toLowerCase().includes('việt nam')) {
            
            // Tính điểm phù hợp
            let score = 0;
            const descLower = prediction.description.toLowerCase();
            const wardNameLower = ward.name.toLowerCase();
            
            if (descLower.includes(wardNameLower)) score += 10;
            if (descLower.includes('phường')) score += 5;
            if (descLower.includes('quận')) score += 3;
            if (prediction.types?.includes('administrative_area')) score += 5;
            
            if (score > bestScore) {
              bestScore = score;
              bestMatch = prediction;
            }
          }
        }
      }
      
      // Delay để tránh rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (bestMatch) {
      // Lấy chi tiết địa điểm
      const detailData = await getPlaceDetail(bestMatch.place_id);
      
      if (detailData && detailData.status === 'OK' && detailData.result) {
        const adminInfo = extractAdminInfo(detailData.result);
        
        // Cập nhật dữ liệu phường
        const updatedWard = {
          ...ward,
          // Thông tin cơ bản
          place_id: adminInfo.placeId,
          description: adminInfo.description,
          types: adminInfo.types,
          compound: adminInfo.compound,
          
          // Thông tin hành chính hiện tại
          current_district: adminInfo.district,
          current_commune: adminInfo.commune,
          current_province: adminInfo.province,
          
          // Thông tin quận cũ
          deprecated_district: adminInfo.deprecatedDistrict,
          deprecated_commune: adminInfo.deprecatedCommune,
          has_deprecated_unit: adminInfo.hasDeprecatedUnit,
          
          // Thông tin sáp nhập
          old_wards: adminInfo.oldWards,
          old_district_info: adminInfo.oldDistrictInfo,
          merged_from: adminInfo.mergedFrom,
          
          // Thông tin bổ sung
          last_updated: new Date().toISOString(),
          source: 'goong_api'
        };
        
        
        return updatedWard;
      }
    }
    
    return ward;
    
  } catch (error) {
    console.error(`  ❌ Error updating ${ward.name}:`, error.message);
    return ward;
  }
}

/**
 * Main function
 */
async function main() {
  
  const updatedWards = [];
  const errors = [];
  
  // Cập nhật từng phường
  for (let i = 0; i < currentData.wards.length; i++) {
    try {
      const updatedWard = await updateWardData(currentData.wards[i], i, currentData.wards.length);
      updatedWards.push(updatedWard);
    } catch (error) {
      console.error(`Error processing ward ${i}:`, error);
      errors.push({ index: i, ward: currentData.wards[i], error: error.message });
      updatedWards.push(currentData.wards[i]); // Keep original data
    }
  }
  
  // Tạo dữ liệu mới
  const newData = {
    ...currentData,
    wards: updatedWards,
    last_updated: new Date().toISOString(),
    update_source: 'goong_api',
    total_wards: updatedWards.length,
    errors: errors
  };
  
  // Lưu dữ liệu mới
  const outputPath = path.join(__dirname, '../src/data/tphcm-wards-updated.json');
  fs.writeFileSync(outputPath, JSON.stringify(newData, null, 2), 'utf8');
  
  
  if (errors.length > 0) {
  }
}

// Chạy script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  searchPlaces,
  getPlaceDetail,
  extractAdminInfo,
  updateWardData
};
