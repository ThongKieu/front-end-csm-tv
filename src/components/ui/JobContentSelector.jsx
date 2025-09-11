"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Check } from "lucide-react";

const JobContentSelector = ({
  value = "",
  onChange,
  onContentChange,
  className = "",
  showPreview = true,
  label = "Nội dung công việc",
  required = false,
  error = null,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load services from API
  useEffect(() => {
    const fetchServices = async () => {
      if (services.length > 0) return; // Already loaded
      
      setLoading(true);
      try {
        const response = await fetch('https://data.thoviet.com/api/get-service-all');
        const data = await response.json();
        
        if (data.success && data.data) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [services.length]);

  // Filter services based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredServices([]);
      setShowDropdown(false);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = services.filter(service => 
      service.name.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredServices(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchTerm, services]);

  // Update job content when selected services change
  useEffect(() => {
    if (!isInitialized) return; // Don't update during initialization
    
    const content = selectedServices.map(service => service.name).join(", ");
    console.log("JobContentSelector - selectedServices changed:", {
      selectedServices: selectedServices.map(s => s.name),
      content,
      value,
      isInitialized
    });
    
    if (onContentChange && content !== value) {
      console.log("JobContentSelector - calling onContentChange with:", content);
      onContentChange(content);
    }
  }, [selectedServices, onContentChange, value, isInitialized]);

  // Parse existing content when value changes (only once)
  useEffect(() => {
    console.log("JobContentSelector - parse existing content:", {
      value,
      isInitialized,
      servicesLength: services.length
    });
    
    if (value && !isInitialized && services.length > 0) {
      // Try to match existing content with services
      const matchedServices = services.filter(service => 
        value.includes(service.name)
      );
      console.log("JobContentSelector - matchedServices:", matchedServices.map(s => s.name));
      
      if (matchedServices.length > 0) {
        setSelectedServices(matchedServices);
        // Also call onContentChange to ensure parent component is updated
        if (onContentChange) {
          const content = matchedServices.map(service => service.name).join(", ");
          console.log("JobContentSelector - calling onContentChange during init:", content);
          onContentChange(content);
        }
      }
      setIsInitialized(true);
    } else if (!value && !isInitialized && services.length > 0) {
      // If no value but services are loaded, mark as initialized
      console.log("JobContentSelector - no value, marking as initialized");
      setIsInitialized(true);
    }
  }, [value, services, isInitialized, onContentChange]);

  const handleServiceSelect = useCallback((service) => {
    console.log("JobContentSelector - handleServiceSelect called with:", service.name);
    const isAlreadySelected = selectedServices.some(s => s.id === service.id);
    if (!isAlreadySelected) {
      setSelectedServices(prev => {
        const newServices = [...prev, service];
        console.log("JobContentSelector - new selectedServices:", newServices.map(s => s.name));
        return newServices;
      });
    }
    setSearchTerm("");
    setShowDropdown(false);
  }, [selectedServices]);

  const handleServiceRemove = useCallback((serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedServices([]);
    setSearchTerm("");
    setShowDropdown(false);
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 w-3 h-3 text-gray-400 transform -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchTerm.trim() && filteredServices.length > 0) {
              setShowDropdown(true);
            }
          }}
          className={`w-full pl-7 pr-3 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:ring-1 focus:ring-brand-green focus:border-brand-green bg-white ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          placeholder="Tìm kiếm dịch vụ..."
          disabled={disabled}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 rounded-full border-b-2 animate-spin border-brand-green"></div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showDropdown && filteredServices.length > 0 && (
          <div className="overflow-y-auto absolute z-10 mt-1 w-full max-h-40 bg-white rounded border border-gray-200 shadow-lg">
            {filteredServices.map((service) => {
              const isSelected = selectedServices.some(s => s.id === service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`px-2 py-1 text-xs cursor-pointer ${
                    isSelected 
                      ? "bg-brand-green/10 text-brand-green" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{service.name}</span>
                    {isSelected && <Check className="flex-shrink-0 w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Services */}
      {selectedServices.length > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Đã chọn ({selectedServices.length}):</span>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={disabled}
              className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              × Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="inline-flex items-center px-1.5 py-0.5 text-xs rounded border bg-brand-green/10 text-brand-green border-brand-green/20"
              >
                <span className="truncate max-w-20">{service.name}</span>
                <button
                  type="button"
                  onClick={() => handleServiceRemove(service.id)}
                  disabled={disabled}
                  className="ml-1 text-brand-green/60 hover:text-brand-green disabled:opacity-50"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Preview */}
      {showPreview && (
        <div className="p-2 bg-gray-50 rounded border">
          <div className="mb-1 text-xs text-gray-600">{label}:</div>
          <div className="text-xs text-gray-800">
            {selectedServices.length > 0 
              ? selectedServices.map(service => service.name).join(", ")
              : "Tìm kiếm và chọn dịch vụ..."
            }
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default JobContentSelector;
