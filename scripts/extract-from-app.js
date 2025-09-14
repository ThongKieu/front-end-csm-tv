#!/usr/bin/env node

/**
 * Script để trích xuất dữ liệu từ ứng dụng hiện tại
 * Vì API đang hoạt động trong ứng dụng, ta có thể sử dụng dữ liệu đó
 */

const fs = require('fs');
const path = require('path');

// Đọc dữ liệu hiện tại
const currentDataPath = path.join(__dirname, '../src/data/tphcm-wards-complete.json');
const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf8'));

/**
 * Tạo dữ liệu cập nhật dựa trên thông tin hiện có và logic từ GoongContext
 */
function createEnhancedData() {
  const enhancedWards = currentData.wards.map((ward, index) => {
    // Trích xuất thông tin từ formed_from
    const formedFrom = ward.formed_from || '';
    
    // Tìm các phường cũ từ formed_from
    const oldWards = [];
    const wardPatterns = [
      /(?:Phường|phường)\s*(\d+(?:\s*,\s*\d+)*)/gi,
      /(?:^|\s)(\d+(?:\s*,\s*\d+)*)(?:\s|$)/gi
    ];
    
    wardPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(formedFrom)) !== null) {
        if (match[1]) {
          const wardText = match[1].trim();
          const wards = wardText.split(',').map(w => {
            const cleanWard = w.trim().replace(/\D/g, '');
            return cleanWard;
          }).filter(w => w && w.length > 0);
          
          wards.forEach(w => {
            if (w && !oldWards.includes(w)) {
              oldWards.push(w);
            }
          });
        }
      }
    });
    
    // Tìm quận cũ từ formed_from
    const oldDistrictInfo = [];
    
    // Logic đặc biệt cho một số phường cụ thể dựa trên formed_from
    if (formedFrom.includes('(Quận 10)')) {
      // Phường Diên Hồng được sáp nhập từ các phường của Quận 6, 8, 14 cũ
      if (ward.name === 'Phường Diên Hồng') {
        oldDistrictInfo.push(
          { district: 'Quận 6 cũ', commune: '', province: 'TP. Hồ Chí Minh' },
          { district: 'Quận 8 cũ', commune: '', province: 'TP. Hồ Chí Minh' },
          { district: 'Quận 14 cũ', commune: '', province: 'TP. Hồ Chí Minh' }
        );
      }
    }
    
    // Logic chung cho các phường khác
    const districtPatterns = [
      /(?:Quận|quận)\s*(\d+)/gi,
      /(?:Quận|quận)\s*(\d+(?:\s*,\s*\d+)*)/gi
    ];
    
    districtPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(formedFrom)) !== null) {
        if (match[1]) {
          const districtText = match[1].trim();
          const districts = districtText.split(',').map(d => {
            const cleanDistrict = d.trim();
            return `Quận ${cleanDistrict} cũ`;
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
    
    // Tạo summary text
    let summaryText = '';
    if (oldWards.length > 0 && oldDistrictInfo.length > 0) {
      const wardText = oldWards.length === 1 ? `Phường ${oldWards[0]}` : `Phường ${oldWards.join(', ')}`;
      const districtText = oldDistrictInfo.length === 1 ? oldDistrictInfo[0].district : oldDistrictInfo.map(d => d.district).join(', ');
      summaryText = `Được sáp nhập từ ${wardText} của ${districtText}`;
    } else if (oldDistrictInfo.length > 0) {
      const districtText = oldDistrictInfo.length === 1 ? oldDistrictInfo[0].district : oldDistrictInfo.map(d => d.district).join(', ');
      summaryText = `Thuộc ${districtText} của TP.HCM`;
    }
    
    // Xác định quận hiện tại từ formed_from (quận trong ngoặc đơn)
    let currentDistrict = '';
    const districtMatch = formedFrom.match(/\(([^)]+)\)/);
    if (districtMatch) {
      const districtInParentheses = districtMatch[1];
      if (districtInParentheses.includes('Quận 1')) currentDistrict = 'Quận 1';
      else if (districtInParentheses.includes('Quận 2')) currentDistrict = 'Quận 2';
      else if (districtInParentheses.includes('Quận 3')) currentDistrict = 'Quận 3';
      else if (districtInParentheses.includes('Quận 4')) currentDistrict = 'Quận 4';
      else if (districtInParentheses.includes('Quận 5')) currentDistrict = 'Quận 5';
      else if (districtInParentheses.includes('Quận 6')) currentDistrict = 'Quận 6';
      else if (districtInParentheses.includes('Quận 7')) currentDistrict = 'Quận 7';
      else if (districtInParentheses.includes('Quận 8')) currentDistrict = 'Quận 8';
      else if (districtInParentheses.includes('Quận 9')) currentDistrict = 'Quận 9';
      else if (districtInParentheses.includes('Quận 10')) currentDistrict = 'Quận 10';
      else if (districtInParentheses.includes('Quận 11')) currentDistrict = 'Quận 11';
      else if (districtInParentheses.includes('Quận 12')) currentDistrict = 'Quận 12';
      else if (districtInParentheses.includes('Quận Thủ Đức')) currentDistrict = 'Quận Thủ Đức';
      else if (districtInParentheses.includes('Quận Gò Vấp')) currentDistrict = 'Quận Gò Vấp';
      else if (districtInParentheses.includes('Quận Bình Thạnh')) currentDistrict = 'Quận Bình Thạnh';
      else if (districtInParentheses.includes('Quận Tân Bình')) currentDistrict = 'Quận Tân Bình';
      else if (districtInParentheses.includes('Quận Tân Phú')) currentDistrict = 'Quận Tân Phú';
      else if (districtInParentheses.includes('Quận Phú Nhuận')) currentDistrict = 'Quận Phú Nhuận';
      else if (districtInParentheses.includes('Quận Bình Tân')) currentDistrict = 'Quận Bình Tân';
      else if (districtInParentheses.includes('Quận Củ Chi')) currentDistrict = 'Quận Củ Chi';
      else if (districtInParentheses.includes('Quận Hóc Môn')) currentDistrict = 'Quận Hóc Môn';
      else if (districtInParentheses.includes('Quận Bình Chánh')) currentDistrict = 'Quận Bình Chánh';
      else if (districtInParentheses.includes('Quận Nhà Bè')) currentDistrict = 'Quận Nhà Bè';
      else if (districtInParentheses.includes('Quận Cần Giờ')) currentDistrict = 'Quận Cần Giờ';
    }
    
    return {
      ...ward,
      // Thông tin cơ bản
      place_id: `extracted_${ward.code}`,
      description: `${ward.name}, ${currentDistrict || 'TP.HCM'}, TP. Hồ Chí Minh`,
      types: ['administrative_area'],
      
      // Thông tin hành chính hiện tại
      current_district: currentDistrict || 'TP.HCM',
      current_commune: ward.name,
      current_province: 'TP. Hồ Chí Minh',
      
      // Thông tin quận cũ
      deprecated_district: oldDistrictInfo.map(d => d.district).join(', '),
      has_deprecated_unit: oldDistrictInfo.length > 0,
      
      // Thông tin sáp nhập
      old_wards: oldWards,
      old_district_info: oldDistrictInfo,
      
      // Thông tin bổ sung
      merge_summary: {
        hasMergeInfo: oldWards.length > 0 || oldDistrictInfo.length > 0,
        summaryText: summaryText,
        currentDistrict: currentDistrict || 'TP.HCM',
        currentCommune: ward.name,
        oldWardsList: oldWards,
        oldDistrictsList: oldDistrictInfo.map(d => d.district)
      },
      
      last_updated: new Date().toISOString(),
      source: 'extracted_from_formed_from'
    };
  });
  
  return {
    ...currentData,
    wards: enhancedWards,
    last_updated: new Date().toISOString(),
    update_source: 'extracted_from_formed_from',
    total_wards: enhancedWards.length,
    description: "Dữ liệu cập nhật từ thông tin formed_from - Cấu trúc hành chính mới của TP.HCM"
  };
}

/**
 * Main function
 */
function main() {
  
  const enhancedData = createEnhancedData();
  
  // Lưu dữ liệu đã cập nhật
  const outputPath = path.join(__dirname, '../src/data/tphcm-wards-enhanced.json');
  fs.writeFileSync(outputPath, JSON.stringify(enhancedData, null, 2), 'utf8');
  
  
  // Thống kê
  const wardsWithOldInfo = enhancedData.wards.filter(w => w.has_deprecated_unit);
  const wardsWithMergeInfo = enhancedData.wards.filter(w => w.merge_summary.hasMergeInfo);
  
  
  
}

main();
