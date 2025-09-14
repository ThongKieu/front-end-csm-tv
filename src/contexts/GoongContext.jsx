"use client";

import React, { createContext, useContext } from 'react';

// Goong API Configuration
const GOONG_CONFIG = {
  API_KEY: "sVaACBVHw2KeYaL8C5BvH3fvM20S7LLqX6V57plr",
  BASE_URL: "https://rsapi.goong.io",
  ENDPOINTS: {
    AUTOCOMPLETE: "/v2/place/autocomplete",
    DETAIL: "/Place/Detail",
    GEOCODE: "/Geocode"
  },
  DEFAULT_LOCATION: "10.7552929,106.3655765", // Ho Chi Minh City coordinates
  DEFAULT_LIMIT: 50,
  DEFAULT_DEBOUNCE_DELAY: 300,
  DEFAULT_PARAMS: {
    has_deprecated_administrative_unit: true
  }
};

// Create the context with default value
const GoongContext = createContext(null);

// Custom hook to use the Goong context
export const useGoong = () => {
  const context = useContext(GoongContext);
  
  // Check if we're on client side
  if (typeof window === 'undefined') {
    // Server side rendering - return null or throw error
    throw new Error('useGoong must be used within a GoongProvider');
  }
  
  if (!context) {
    console.error('useGoong must be used within a GoongProvider');
    throw new Error('useGoong must be used within a GoongProvider');
  }
  
  return context;
};

// Provider component
export const GoongProvider = ({ children }) => {
  // Helper function to build API URL
  const buildApiUrl = (endpoint, params = {}) => {
    const url = new URL(GOONG_CONFIG.BASE_URL + endpoint);
    
    // Add API key
    url.searchParams.append('api_key', GOONG_CONFIG.API_KEY);
    
    // Add default parameters first
    Object.entries(GOONG_CONFIG.DEFAULT_PARAMS).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    // Add other parameters (override defaults if provided)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  };

  // Search places using autocomplete
  const searchPlaces = async (query, options = {}) => {
    const {
      location = GOONG_CONFIG.DEFAULT_LOCATION,
      limit = GOONG_CONFIG.DEFAULT_LIMIT,
      radius = 10
    } = options;

    if (!query || query.length < 2) {
      return { status: "OK", predictions: [] };
    }

    try {
      const url = buildApiUrl(GOONG_CONFIG.ENDPOINTS.AUTOCOMPLETE, {
        input: query,
        location: location,
        limit: limit,
        radius: radius
      });

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        if (response.status === 429) {
          throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.');
        } else if (response.status === 401) {
          throw new Error('Lỗi xác thực API. Vui lòng kiểm tra API key.');
        } else if (response.status >= 500) {
          throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
        } else {
          throw new Error(`Lỗi API: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Goong API search error:', error);
      return { status: "ERROR", predictions: [], error: error.message };
    }
  };

  // Get place details
  const getPlaceDetails = async (placeId) => {
    try {
      const url = buildApiUrl(GOONG_CONFIG.ENDPOINTS.DETAIL, {
        place_id: placeId
      });

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Goong API details error:', error);
      return { status: "ERROR", result: null, error: error.message };
    }
  };

  // Filter HCMC places
  const filterHCMCPlaces = (predictions, searchTerm = '') => {
    if (!predictions || !Array.isArray(predictions)) {
      return [];
    }

    return predictions.filter(place => {
      // Check current address
      const isCurrentHCMC = place.description.includes('TP. Hồ Chí Minh') || 
                            place.description.includes('Ho Chi Minh City') ||
                            place.description.includes('Hồ Chí Minh') ||
                            place.compound?.province === 'Hồ Chí Minh';
      
      // Check deprecated address
      const isDeprecatedHCMC = place.deprecated_administrative_unit?.province === 'Hồ Chí Minh' ||
                               (place.deprecated_administrative_unit && 
                                (place.description.includes('TP. Hồ Chí Minh') || 
                                 place.description.includes('Hồ Chí Minh')));
      
      const isInHCMC = isCurrentHCMC || isDeprecatedHCMC;
      
      // If no search term, return all HCMC places
      if (!searchTerm) return isInHCMC;
      
      // For specific searches, filter more strictly
      const searchLower = searchTerm.toLowerCase();
      const isDistrictSearch = searchLower.includes('quận') || searchLower.includes('huyện');
      
      if (isDistrictSearch) {
        const searchDistrict = searchLower.replace(/^(quận|huyện)\s*/i, '').trim();
        
        // For district searches, prioritize district-level results
        const isDistrictLevel = place.types?.includes('administrative_area_level_2') || 
                               place.types?.includes('administrative_area_level_1');
        
        // Check current district
        const currentDistrict = place.compound?.district || '';
        const currentDistrictLower = currentDistrict?.toLowerCase() || '';
        const currentDistrictName = currentDistrictLower.replace(/^(quận|huyện)\s*/i, '').trim();
        
        // Check deprecated district
        const deprecatedDistrict = place.deprecated_administrative_unit?.district || '';
        const deprecatedDistrictLower = deprecatedDistrict?.toLowerCase() || '';
        const deprecatedDistrictName = deprecatedDistrictLower.replace(/^(quận|huyện)\s*/i, '').trim();
        
        // Extract numbers for numerical districts
        const searchNumber = searchDistrict.match(/\d+/);
        const currentNumber = currentDistrictName.match(/\d+/);
        const deprecatedNumber = deprecatedDistrictName.match(/\d+/);
        
        // Check if current district matches
        const currentMatches = currentDistrictName === searchDistrict || 
                              (searchNumber && currentNumber && searchNumber[0] === currentNumber[0]) ||
                              (searchDistrict && currentDistrictName.includes(searchDistrict));
        
        // Check if deprecated district matches
        const deprecatedMatches = deprecatedDistrictName === searchDistrict ||
                                 (searchNumber && deprecatedNumber && searchNumber[0] === deprecatedNumber[0]) ||
                                 (searchDistrict && deprecatedDistrictName.includes(searchDistrict));
        
        // For district searches, prioritize district-level results
        if (isDistrictLevel && (currentMatches || deprecatedMatches)) {
          return true;
        }
        
        // Allow ward-level results only if they match the district search
        return isInHCMC && (currentMatches || deprecatedMatches);
      }
      
      return isInHCMC;
    });
  };

  // Extract administrative information from place data
  const extractAdminInfo = (place) => {
    const district = place.compound?.district || '';
    const commune = place.compound?.commune || '';
    const province = place.compound?.province || '';
    
    // Check for deprecated administrative units
    const deprecatedDistrict = place.deprecated_administrative_unit?.district || '';
    const deprecatedCommune = place.deprecated_administrative_unit?.commune || '';
    
    // Extract merged information from description or other fields
    const mergedFrom = place.merged_from || place.formed_from || '';
    const oldWards = [];
    
    // Try to extract old ward information from description
    if (place.description) {
      // Look for patterns like "Phường 6, 8, 14" or "từ Phường 6, Phường 8"
      const wardPatterns = [
        // Pattern 1: "từ Phường 6, Phường 8, Phường 14"
        /(?:từ|hợp thành từ|sáp nhập từ)\s*(?:Phường\s*)?(\d+(?:\s*,\s*(?:Phường\s*)?\d+)*)/gi,
        // Pattern 2: "Phường 6, 8, 14"
        /(?:Phường|phường)\s*(\d+(?:\s*,\s*\d+)*)/gi,
        // Pattern 3: Just numbers "6, 8, 14"
        /(?:^|\s)(\d+(?:\s*,\s*\d+)*)(?:\s|$)/gi,
        // Pattern 4: "sáp nhập Phường 6, Phường 8"
        /(?:sáp nhập|hợp thành)\s*(?:Phường\s*)?(\d+(?:\s*,\s*(?:Phường\s*)?\d+)*)/gi
      ];
      
      wardPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(place.description)) !== null) {
          if (match[1]) {
            // Clean up the matched text
            let wardText = match[1].trim();
            // Remove "Phường" if it appears in the middle
            wardText = wardText.replace(/Phường\s*/gi, '');
            
            const wards = wardText.split(',').map(w => {
              const cleanWard = w.trim().replace(/\D/g, ''); // Keep only numbers
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

    // Extract old district information from deprecated_administrative_unit
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
    
    // Also try to extract old district info from description if not found in deprecated_administrative_unit
    if (oldDistrictInfo.length === 0 && place.description) {
      // Look for patterns like "Quận 6 cũ", "Quận 8 cũ", "Quận 14 cũ"
      const oldDistrictPatterns = [
        // Pattern 1: "Quận 6 cũ", "Quận 8 cũ"
        /(Quận\s+\d+\s+cũ)/gi,
        // Pattern 2: "Quận 6, Quận 8, Quận 14 cũ"
        /(Quận\s+\d+(?:\s*,\s*Quận\s+\d+)*\s+cũ)/gi,
        // Pattern 3: "của Quận 6, Quận 8"
        /(?:của|từ)\s*(Quận\s+\d+(?:\s*,\s*Quận\s+\d+)*)/gi,
        // Pattern 4: "Quận 6, 8, 14 cũ"
        /(Quận\s+\d+(?:\s*,\s*\d+)*\s+cũ)/gi
      ];
      
      oldDistrictPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(place.description)) !== null) {
          if (match[1]) {
            const districtText = match[1].trim();
            // Split by comma and clean up
            const districts = districtText.split(',').map(d => {
              let cleanDistrict = d.trim();
              // Add "Quận" if missing
              if (!cleanDistrict.includes('Quận') && !cleanDistrict.includes('cũ')) {
                cleanDistrict = `Quận ${cleanDistrict}`;
              }
              // Add "cũ" if missing
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

    // Create mapping of old wards to their districts
    const wardDistrictMapping = [];
    if (oldWards.length > 0 && oldDistrictInfo.length > 0) {
      // If we have both old wards and old districts, create mapping
      oldWards.forEach(ward => {
        oldDistrictInfo.forEach(districtInfo => {
          wardDistrictMapping.push({
            ward: ward,
            district: districtInfo.district,
            commune: districtInfo.commune || '',
            province: districtInfo.province || 'Hồ Chí Minh'
          });
        });
      });
    }

    // Create a summary of the merge information
    const mergeSummary = {
      currentDistrict: district,
      currentCommune: commune,
      oldWardsList: oldWards,
      oldDistrictsList: oldDistrictInfo.map(d => d.district),
      hasMergeInfo: oldWards.length > 0 && oldDistrictInfo.length > 0,
      summaryText: ''
    };

    // Generate summary text
    if (mergeSummary.hasMergeInfo) {
      const wardText = oldWards.length === 1 ? `Phường ${oldWards[0]}` : `Phường ${oldWards.join(', ')}`;
      const districtText = oldDistrictInfo.length === 1 ? oldDistrictInfo[0].district : oldDistrictInfo.map(d => d.district).join(', ');
      mergeSummary.summaryText = `Được sáp nhập từ ${wardText} của ${districtText}`;
    } else if (oldDistrictInfo.length > 0) {
      // If we have old district info but no merge info, create a simple summary
      const districtText = oldDistrictInfo.length === 1 ? oldDistrictInfo[0].district : oldDistrictInfo.map(d => d.district).join(', ');
      mergeSummary.summaryText = `Thuộc ${districtText} của TP.HCM`;
      mergeSummary.hasMergeInfo = true;
    }

    // Try to extract district information from description
    if (place.description) {
      // Look for patterns like "Quận 6, 8, 14" or "Quận 6, Quận 8"
      const districtPatterns = [
        // Pattern 1: "Quận 6, 8, 14"
        /(?:Quận|quận)\s*(\d+(?:\s*,\s*\d+)*)/gi,
        // Pattern 2: "Quận 6, Quận 8, Quận 14"
        /(?:Quận|quận)\s*(\d+(?:\s*,\s*(?:Quận|quận)\s*\d+)*)/gi,
        // Pattern 3: "6, 8, 14 cũ"
        /(\d+(?:\s*,\s*\d+)*)\s*(?:cũ|old)/gi
      ];
      
      districtPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(place.description)) !== null) {
          if (match[1]) {
            let districtText = match[1].trim();
            // Remove "Quận" if it appears in the middle
            districtText = districtText.replace(/Quận\s*/gi, '');
            
            const districts = districtText.split(',').map(d => {
              const cleanDistrict = d.trim().replace(/\D/g, ''); // Keep only numbers
              return cleanDistrict;
            }).filter(d => d && d.length > 0);
            
            districts.forEach(district => {
              if (district && !oldDistrictInfo.some(info => info.district.includes(district))) {
                oldDistrictInfo.push({
                  district: `Quận ${district}`,
                  commune: '',
                  province: 'Hồ Chí Minh'
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
      isHCMC: province === 'Hồ Chí Minh',
      // Deprecated (old) administrative units
      deprecatedDistrict,
      deprecatedCommune,
      hasDeprecatedUnit: !!(deprecatedDistrict || deprecatedCommune),
      // Merged information
      mergedFrom,
      oldWards,
      // Old district information
      oldDistrictInfo,
      // Ward to district mapping
      wardDistrictMapping,
      // Merge summary
      mergeSummary
    };
  };

  // Compare old vs new administrative units
  const compareAdministrativeUnits = (place) => {
    const adminInfo = extractAdminInfo(place);
    
    const comparison = {
      current: {
        district: adminInfo.district,
        commune: adminInfo.commune,
        province: adminInfo.province
      },
      old: {
        district: adminInfo.deprecatedDistrict,
        commune: adminInfo.deprecatedCommune,
        province: adminInfo.province // Province usually stays the same
      },
      hasChanged: false,
      changes: []
    };

    // Check for changes
    if (adminInfo.district !== adminInfo.deprecatedDistrict && adminInfo.deprecatedDistrict) {
      comparison.hasChanged = true;
      comparison.changes.push({
        type: 'district',
        old: adminInfo.deprecatedDistrict,
        new: adminInfo.district
      });
    }

    if (adminInfo.commune !== adminInfo.deprecatedCommune && adminInfo.deprecatedCommune) {
      comparison.hasChanged = true;
      comparison.changes.push({
        type: 'commune',
        old: adminInfo.deprecatedCommune,
        new: adminInfo.commune
      });
    }

    return comparison;
  };

  const value = {
    // Configuration
    config: GOONG_CONFIG,
    
    // API methods
    searchPlaces,
    getPlaceDetails,
    buildApiUrl,
    
    // Helper methods
    filterHCMCPlaces,
    extractAdminInfo,
    compareAdministrativeUnits
  };

  return (
    <GoongContext.Provider value={value}>
      {children}
    </GoongContext.Provider>
  );
};

export default GoongContext;
