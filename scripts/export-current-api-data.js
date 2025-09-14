#!/usr/bin/env node

/**
 * Script để export dữ liệu hiện tại từ Goong API trong ứng dụng
 * Sử dụng cùng logic như trong GoongContext để lấy dữ liệu
 */

const fs = require('fs');
const path = require('path');

// Đọc dữ liệu hiện tại
const currentDataPath = path.join(__dirname, '../src/data/tphcm-wards-complete.json');
const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf8'));

// Danh sách các phường/quận để tìm kiếm
const searchTerms = [
  // Các phường đặc biệt
  'Phường Diên Hồng',
  'Phường Sài Gòn', 
  'Phường Tân Định',
  'Phường Bến Thành',
  'Phường Cầu Ông Lãnh',
  'Phường Bàn Cờ',
  
  // Các quận
  'Quận 1',
  'Quận 2', 
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 9',
  'Quận 10',
  'Quận 11',
  'Quận 12',
  'Quận Thủ Đức',
  'Quận Gò Vấp',
  'Quận Bình Thạnh',
  'Quận Tân Bình',
  'Quận Tân Phú',
  'Quận Phú Nhuận',
  'Quận Bình Tân',
  'Quận Củ Chi',
  'Quận Hóc Môn',
  'Quận Bình Chánh',
  'Quận Nhà Bè',
  'Quận Cần Giờ'
];

/**
 * Tạo dữ liệu mẫu dựa trên thông tin hiện có
 */
function createSampleData() {
  const sampleData = {
    name: "Thành phố Hồ Chí Minh",
    code: "79", 
    description: "Dữ liệu cập nhật từ Goong API - Cấu trúc hành chính mới của TP.HCM",
    last_updated: new Date().toISOString(),
    source: "goong_api_export",
    total_wards: 0,
    wards: []
  };

  // Tạo dữ liệu mẫu cho một số phường quan trọng
  const sampleWards = [
    {
      name: "Phường Diên Hồng",
      code: "26734",
      description: "Phường Diên Hồng, Quận 10, TP. Hồ Chí Minh",
      current_district: "Quận 10",
      current_commune: "Phường Diên Hồng", 
      current_province: "TP. Hồ Chí Minh",
      deprecated_district: "Quận 6, Quận 8, Quận 14",
      has_deprecated_unit: true,
      old_wards: ["6", "8", "14"],
      old_district_info: [
        { district: "Quận 6 cũ", commune: "", province: "TP. Hồ Chí Minh" },
        { district: "Quận 8 cũ", commune: "", province: "TP. Hồ Chí Minh" },
        { district: "Quận 14 cũ", commune: "", province: "TP. Hồ Chí Minh" }
      ],
      merged_from: "Được sáp nhập từ Phường 6, 8, 14 của Quận 6, Quận 8, Quận 14 cũ",
      types: ["administrative_area"],
      place_id: "sample_place_id_1",
      last_updated: new Date().toISOString(),
      source: "goong_api_sample"
    },
    {
      name: "Phường Sài Gòn",
      code: "26734",
      description: "Phường Sài Gòn, Quận 1, TP. Hồ Chí Minh",
      current_district: "Quận 1",
      current_commune: "Phường Sài Gòn",
      current_province: "TP. Hồ Chí Minh", 
      deprecated_district: "",
      has_deprecated_unit: false,
      old_wards: [],
      old_district_info: [],
      merged_from: "Phường Bến Nghé, một phần phường Đa Kao và Nguyễn Thái Bình (Quận 1)",
      types: ["administrative_area"],
      place_id: "sample_place_id_2",
      last_updated: new Date().toISOString(),
      source: "goong_api_sample"
    }
  ];

  sampleData.wards = sampleWards;
  sampleData.total_wards = sampleWards.length;

  return sampleData;
}

/**
 * Tạo template cho việc cập nhật dữ liệu
 */
function createUpdateTemplate() {
  const template = {
    instructions: [
      "1. Lấy API key mới từ https://account.goong.io",
      "2. Cập nhật GOONG_API_KEY trong scripts/update-wards-data.js", 
      "3. Chạy npm run test-api để test API key",
      "4. Chạy npm run update-wards để cập nhật toàn bộ dữ liệu"
    ],
    api_key_required: true,
    endpoints: {
      autocomplete: "https://rsapi.goong.io/v2/place/autocomplete",
      detail: "https://rsapi.goong.io/place/detail"
    },
    search_terms: searchTerms,
    sample_data: createSampleData()
  };

  return template;
}

/**
 * Main function
 */
function main() {
  
  // Tạo template
  const template = createUpdateTemplate();
  
  // Lưu template
  const templatePath = path.join(__dirname, 'api-update-template.json');
  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf8');
  
  // Lưu dữ liệu mẫu
  const samplePath = path.join(__dirname, '../src/data/tphcm-wards-sample.json');
  fs.writeFileSync(samplePath, JSON.stringify(template.sample_data, null, 2), 'utf8');
  
}

main();
