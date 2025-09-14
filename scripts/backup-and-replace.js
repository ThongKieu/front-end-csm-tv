#!/usr/bin/env node

/**
 * Script để backup file gốc và thay thế bằng dữ liệu đã cập nhật
 */

const fs = require('fs');
const path = require('path');

function main() {
  
  const originalPath = path.join(__dirname, '../src/data/tphcm-wards-complete.json');
  const enhancedPath = path.join(__dirname, '../src/data/tphcm-wards-enhanced.json');
  const backupPath = path.join(__dirname, '../src/data/tphcm-wards-complete-backup.json');
  
  try {
    // Đọc dữ liệu enhanced
    const enhancedData = JSON.parse(fs.readFileSync(enhancedPath, 'utf8'));
    
    // Backup file gốc
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
    }
    
    // Thay thế file gốc
    fs.writeFileSync(originalPath, JSON.stringify(enhancedData, null, 2), 'utf8');
    
    
    const wardsWithOldInfo = enhancedData.wards.filter(w => w.has_deprecated_unit);
    const wardsWithMergeInfo = enhancedData.wards.filter(w => w.merge_summary.hasMergeInfo);
    
    
    
    
  } catch (error) {
    console.error('❌ Error during replacement:', error.message);
    process.exit(1);
  }
}

main();
