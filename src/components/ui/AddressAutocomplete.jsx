"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

// Goong API configuration
const GOONG_API_KEY = "sVaACBVHw2KeYaL8C5BvH3fvM20S7LLqX6V57plr";
const GOONG_BASE_URL = "https://rsapi.goong.io/Place/AutoComplete";

export default function AddressAutocomplete({
  value = "",
  onChange = () => {},
  onSelect = () => {},
  placeholder = "Nhập địa chỉ để tìm kiếm tự động...",
  required = false,
  disabled = false,
  className = "",
  label = "Địa chỉ",
  showLabel = true,
  error = false,
  errorMessage = "",
  location = "10.7552929,106.3655765", // Default to Ho Chi Minh City
  minLength = 2,
  debounceDelay = 200,
}) {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const debouncedSearch = useRef(null);

  // Function to search addresses using Goong API
  const searchAddresses = async (query) => {
    if (!query || query.length < minLength) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
      return;
    }

    setIsLoadingAddress(true);

    try {
      const url = `${GOONG_BASE_URL}?api_key=${GOONG_API_KEY}&location=${location}&input=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();

        if (
          data.status === "OK" &&
          data.predictions &&
          data.predictions.length > 0
        ) {
          setAddressSuggestions(data.predictions);
          setShowAddressDropdown(true);
        } else {
          setAddressSuggestions([]);
          setShowAddressDropdown(false);
        }
      } else {
        setAddressSuggestions([]);
        setShowAddressDropdown(false);
      }
    } catch (error) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Debounced search function
  const handleAddressInputChange = (e) => {
    const inputValue = e.target.value;

    // Call the onChange prop
    onChange(inputValue);

    // Clear previous timeout
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }

    // Set new timeout with configurable delay
    debouncedSearch.current = setTimeout(() => {
      searchAddresses(inputValue);
    }, debounceDelay);
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    // Call both onChange and onSelect
    onChange(address.description);
    onSelect(address);

    setShowAddressDropdown(false);
    setAddressSuggestions([]);
  };

  // Cleanup debounced search on unmount
  useEffect(() => {
    return () => {
      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {showLabel && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleAddressInputChange}
          onFocus={() => {
            if (addressSuggestions.length > 0) {
              setShowAddressDropdown(true);
            }
          }}
          onBlur={() => {
            // Delay hiding dropdown to allow clicking on suggestions
            setTimeout(() => {
              setShowAddressDropdown(false);
            }, 200);
          }}
          className={`w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green ${
            error ? "border-red-500" : ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />

        {/* Loading indicator */}
        {isLoadingAddress && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-brand-green animate-spin"></div>
          </div>
        )}

        {/* Address suggestions dropdown */}
        {showAddressDropdown && addressSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {addressSuggestions.map((address, index) => (
              <button
                key={address.place_id}
                type="button"
                onClick={() => handleAddressSelect(address)}
                className="w-full px-3 py-2 text-left transition-colors hover:bg-brand-green/5 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-brand-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {address.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {address.structured_formatting.secondary_text}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
