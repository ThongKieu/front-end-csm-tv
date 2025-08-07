"use client";

import { Plus, Trash2, DollarSign, FileText, User, Phone, MapPin, Calendar, Building, Mail, Crown, Briefcase, Calculator, Zap, ArrowRight, ArrowLeft, Save, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

export default function QuoteForm({ 
  formData, 
  handleInputChange, 
  handleItemChange, 
  addItem, 
  removeItem 
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastFocusedIndex, setLastFocusedIndex] = useState(null);
  const inputRefs = useRef({});

  // Keyboard shortcuts and navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tab navigation: Ctrl + 1,2,3
      if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        setActiveTab(parseInt(e.key) - 1);
      }
      
      // Quick actions
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        addItem();
      }
      
      // Show/hide shortcuts
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      
      // Quick save (Ctrl + S)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        // Trigger save action if available
    
      }
      
      // Navigate between items with arrow keys
      if (e.key === 'ArrowDown' && e.ctrlKey && activeTab === 1) {
        e.preventDefault();
        const nextIndex = (lastFocusedIndex || -1) + 1;
        if (nextIndex < formData.items.length) {
          setLastFocusedIndex(nextIndex);
          inputRefs.current[`item-${nextIndex}-name`]?.focus();
        }
      }
      
      if (e.key === 'ArrowUp' && e.ctrlKey && activeTab === 1) {
        e.preventDefault();
        const prevIndex = (lastFocusedIndex || 0) - 1;
        if (prevIndex >= 0) {
          setLastFocusedIndex(prevIndex);
          inputRefs.current[`item-${prevIndex}-name`]?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, lastFocusedIndex, formData.items.length, addItem]);

  // Auto-focus first input when tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 0) {
        inputRefs.current['customerName']?.focus();
      } else if (activeTab === 1 && formData.items.length > 0) {
        inputRefs.current['item-0-name']?.focus();
      } else if (activeTab === 2) {
        inputRefs.current['note-0']?.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTab, formData.items.length]);

  const addNote = () => {
    const newNotes = [...(formData.notes || []), ""];
    handleInputChange("notes", newNotes);
  };

  const removeNote = (index) => {
    const newNotes = formData.notes.filter((_, i) => i !== index);
    handleInputChange("notes", newNotes);
  };

  const updateNote = (index, value) => {
    const newNotes = [...(formData.notes || [])];
    newNotes[index] = value;
    handleInputChange("notes", newNotes);
  };

  // Quick templates for common services
  const quickTemplates = [
    { name: "Gas máy lạnh R22", price: "150000", unit: "kg" },
    { name: "Gas máy lạnh R32", price: "180000", unit: "kg" },
    { name: "Gas máy lạnh R410A", price: "200000", unit: "kg" },
    { name: "Bảo trì máy lạnh", price: "300000", unit: "lần" },
    { name: "Sửa chữa máy lạnh", price: "500000", unit: "lần" },
  ];

  const addQuickTemplate = (template) => {
    addItem();
    const newIndex = formData.items.length;
    setTimeout(() => {
      handleItemChange(newIndex, "name", template.name);
      handleItemChange(newIndex, "price", template.price);
      handleItemChange(newIndex, "unit", template.unit);
      handleItemChange(newIndex, "quantity", "1");
    }, 50);
  };

  // Calculate VAT for an item based on manual selection
  const calculateItemVat = (item) => {
    if (!formData.vatEnabled) {
      return { rate: 0, amount: 0 };
    }

    // If item has manual VAT selection, use that
    if (item.vatRate && item.vatRate > 0) {
      const price = parseInt(item.price) || 0;
      return {
        rate: item.vatRate,
        amount: Math.round((price * item.vatRate) / 100)
      };
    }

    // Default to 10% if no manual selection
    const price = parseInt(item.price) || 0;
    return {
      rate: 10,
      amount: Math.round((price * 10) / 100)
    };
  };

  // Calculate item total with VAT included
  const calculateItemTotalWithVat = (item) => {
    const vatInfo = calculateItemVat(item);
    const quantity = parseInt(item.quantity) || 0;
    const vatAmount = vatInfo.amount * quantity;
    return (item.total || 0) + vatAmount;
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const vatDetails = {};
    let totalVat = 0;

    formData.items.forEach((item) => {
      const vatInfo = calculateItemVat(item);
      if (vatInfo.rate > 0) {
        const quantity = parseInt(item.quantity) || 0;
        const itemVatAmount = vatInfo.amount * quantity;
        if (!vatDetails[vatInfo.rate]) {
          vatDetails[vatInfo.rate] = 0;
        }
        vatDetails[vatInfo.rate] += itemVatAmount;
        totalVat += itemVatAmount;
      }
    });

    const total = subtotal + totalVat;

    return {
      subtotal,
      vatDetails,
      totalVat,
      total,
    };
  };

  const totals = calculateTotals();

  const tabs = [
    {
      id: 0,
      name: "Thông tin",
      icon: <User className="w-4 h-4" />,
      description: "Khách hàng & Đại diện",
      shortcut: "Ctrl+1"
    },
    {
      id: 1,
      name: "Dịch vụ",
      icon: <DollarSign className="w-4 h-4" />,
      description: "Danh sách & Tổng kết",
      shortcut: "Ctrl+2"
    },
    {
      id: 2,
      name: "Ghi chú",
      icon: <FileText className="w-4 h-4" />,
      description: "Ghi chú bổ sung",
      shortcut: "Ctrl+3"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header with Quick Actions */}
      <div className="flex gap-2 justify-between items-center p-3 pb-2 bg-gradient-to-r rounded-t-lg from-brand-green to-brand-yellow">
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center w-8 h-8 rounded-lg backdrop-blur-sm bg-white/20">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Thông tin khách hàng & Báo giá</h3>
                            <p className="text-xs text-brand-green">Nhập thông tin chi tiết để tạo báo giá</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="flex gap-1 items-center px-2 py-1 text-xs text-white rounded-lg transition-all bg-white/20 hover:bg-white/30"
            title="Phím tắt (Ctrl + /)"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Phím tắt</span>
          </button>
          
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              disabled={activeTab === 0}
              className="p-1 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Tab trước (Ctrl + ←)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab(Math.min(2, activeTab + 1))}
              disabled={activeTab === 2}
              className="p-1 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Tab tiếp (Ctrl + →)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      {showShortcuts && (
        <div className="p-3 bg-brand-yellow/10 border-b border-brand-yellow/20">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="mb-2 font-semibold text-brand-yellow">Điều hướng</h4>
              <div className="space-y-1 text-brand-yellow">
                <div><kbd className="px-1 py-0.5 bg-brand-yellow/20 rounded text-xs">Ctrl + 1,2,3</kbd> Chuyển tab</div>
                <div><kbd className="px-1 py-0.5 bg-brand-yellow/20 rounded text-xs">Ctrl + ←/→</kbd> Tab trước/sau</div>
                <div><kbd className="px-1 py-0.5 bg-brand-yellow/20 rounded text-xs">Ctrl + ↑/↓</kbd> Dịch vụ trước/sau</div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-brand-yellow">Thao tác nhanh</h4>
              <div className="space-y-1 text-brand-yellow">
                <div><kbd className="px-1 py-0.5 bg-brand-yellow/20 rounded text-xs">Ctrl + Enter</kbd> Thêm dịch vụ</div>
                <div><kbd className="px-1 py-0.5 bg-brand-yellow/20 rounded text-xs">Ctrl + S</kbd> Lưu nhanh</div>
                <div><kbd className="px-1 py-0.5 bg-brand-yellow/20 rounded text-xs">Ctrl + /</kbd> Hiện/ẩn phím tắt</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 px-3 text-xs font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-brand-green border-b-2 border-brand-green bg-brand-green/10'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex gap-1 items-center mb-1">
              {tab.icon}
              <span>{tab.name}</span>
            </div>
            <span className="text-xs opacity-75">{tab.description}</span>
            <kbd className="absolute top-1 right-1 text-xs opacity-50">{tab.shortcut}</kbd>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-3">
        {/* Tab 1: Customer & Representative Information */}
        {activeTab === 0 && (
          <div className="space-y-3">
            {/* Customer & Quote Info */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {/* Customer Information */}
              <div className="p-3 space-y-2 bg-white rounded-lg border shadow-sm transition-shadow border-brand-green/20 hover:shadow-md">
                <div className="flex gap-2 items-center">
                  <div className="flex justify-center items-center w-6 h-6 rounded-lg bg-brand-green/10">
                    <User className="w-3 h-3 text-brand-green" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Thông tin khách hàng</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <Input
                      ref={(el) => inputRefs.current['customerName'] = el}
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                      placeholder="Nhập tên khách hàng"
                      required
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          inputRefs.current['customerPhone']?.focus();
                        }
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 text-xs font-medium text-gray-700">
                        <Phone className="inline mr-1 w-3 h-3" />
                        ĐT
                      </label>
                      <Input
                        ref={(el) => inputRefs.current['customerPhone'] = el}
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                        className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                        placeholder="Số điện thoại"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            inputRefs.current['customerEmail']?.focus();
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-medium text-gray-700">
                        <Mail className="inline mr-1 w-3 h-3" />
                        Email
                      </label>
                      <Input
                        ref={(el) => inputRefs.current['customerEmail'] = el}
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                        placeholder="Email"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            inputRefs.current['customerAddress']?.focus();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      <MapPin className="inline mr-1 w-3 h-3" />
                      Địa chỉ
                    </label>
                    <Input
                      ref={(el) => inputRefs.current['customerAddress'] = el}
                      type="text"
                      value={formData.customerAddress}
                      onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                      className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                      placeholder="Địa chỉ khách hàng"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          inputRefs.current['subject']?.focus();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Quote Information */}
              <div className="p-3 space-y-2 bg-white rounded-lg border shadow-sm transition-shadow border-brand-green/20 hover:shadow-md">
                <div className="flex gap-2 items-center">
                  <div className="flex justify-center items-center w-6 h-6 rounded-lg bg-brand-green/10">
                    <Building className="w-3 h-3 text-brand-green" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Thông tin báo giá</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">
                      Tiêu đề báo giá
                    </label>
                    <Input
                      ref={(el) => inputRefs.current['subject'] = el}
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                      placeholder="Nhập tiêu đề báo giá"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          inputRefs.current['validUntil']?.focus();
                        }
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-1 text-xs font-medium text-gray-700">
                        <Calendar className="inline mr-1 w-3 h-3" />
                        Hiệu lực
                      </label>
                      <Input
                        ref={(el) => inputRefs.current['validUntil'] = el}
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => handleInputChange("validUntil", e.target.value)}
                        className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex gap-2 items-center p-2 w-full rounded-lg border bg-brand-green/10 border-brand-green/20">
                        <input
                          type="checkbox"
                          id="vatEnabled"
                          checked={formData.vatEnabled}
                          onChange={(e) => handleInputChange("vatEnabled", e.target.checked)}
                          className="w-3 h-3 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                        />
                        <label htmlFor="vatEnabled" className="text-xs font-medium text-gray-700">
                          Áp dụng VAT
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Representative Information */}
            <div className="p-3 space-y-2 bg-white rounded-lg border shadow-sm transition-shadow border-brand-green/20 hover:shadow-md">
              <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center w-6 h-6 rounded-lg bg-brand-green/10">
                  <Crown className="w-3 h-3 text-brand-green" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Thông tin người làm báo giá</h4>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    <User className="inline mr-1 w-3 h-3" />
                    Tên đại diện
                  </label>
                  <Input
                    ref={(el) => inputRefs.current['representativeName'] = el}
                    type="text"
                    value={formData.representativeName}
                    onChange={(e) => handleInputChange("representativeName", e.target.value)}
                    className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                    placeholder="Tên đại diện"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        inputRefs.current['representativePosition']?.focus();
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    <Briefcase className="inline mr-1 w-3 h-3" />
                    Chức vụ
                  </label>
                  <Input
                    ref={(el) => inputRefs.current['representativePosition'] = el}
                    type="text"
                    value={formData.representativePosition}
                    onChange={(e) => handleInputChange("representativePosition", e.target.value)}
                    className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                    placeholder="Chức vụ"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        inputRefs.current['representativeEmail']?.focus();
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    <Mail className="inline mr-1 w-3 h-3" />
                    Email
                  </label>
                  <Input
                    ref={(el) => inputRefs.current['representativeEmail'] = el}
                    type="email"
                    value={formData.representativeEmail}
                    onChange={(e) => handleInputChange("representativeEmail", e.target.value)}
                    className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                    placeholder="Email đại diện"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        inputRefs.current['representativePhone']?.focus();
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-700">
                    <Phone className="inline mr-1 w-3 h-3" />
                    ĐT
                  </label>
                  <Input
                    ref={(el) => inputRefs.current['representativePhone'] = el}
                    type="tel"
                    value={formData.representativePhone}
                    onChange={(e) => handleInputChange("representativePhone", e.target.value)}
                    className="h-8 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-green focus:ring-brand-green"
                    placeholder="Số điện thoại"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setActiveTab(1); // Move to services tab
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Services List */}
        {activeTab === 1 && (
          <div className="space-y-3">
            {/* Quick Templates */}
            <div className="p-3 bg-gradient-to-r rounded-lg border from-brand-green/10 to-brand-yellow/10 border-brand-green/20">
              <div className="flex gap-2 items-center">
                <Zap className="w-4 h-4 text-brand-green" />
                <h4 className="text-sm font-semibold text-gray-900">Dịch vụ nhanh</h4>
                <span className="text-xs text-gray-500">Click để thêm nhanh</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => addQuickTemplate(template)}
                    className="px-3 py-1 text-xs bg-white rounded-lg border transition-all border-brand-green/20 hover:bg-brand-green/10 hover:border-brand-green/30"
                  >
                    {template.name} - {parseInt(template.price).toLocaleString()}đ
                  </button>
                ))}
              </div>
            </div>

            {/* Items Section */}
            <div className="p-3 space-y-2 bg-white rounded-lg border shadow-sm transition-shadow border-brand-yellow/20 hover:shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="flex justify-center items-center w-6 h-6 rounded-lg bg-brand-yellow/10">
                    <DollarSign className="w-3 h-3 text-brand-yellow" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Danh sách dịch vụ</h4>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex gap-1 items-center px-3 py-1 text-xs text-white bg-gradient-to-r rounded-lg shadow-sm transition-all from-brand-green to-brand-yellow hover:from-green-700 hover:to-yellow-600 hover:shadow-md"
                  title="Thêm dịch vụ (Ctrl + Enter)"
                >
                  <Plus className="w-3 h-3" />
                  Thêm
                </button>
              </div>

              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg border shadow-sm border-brand-yellow/20">
                    {/* Main Item Row */}
                    <div className="grid grid-cols-1 gap-2 mb-2 md:grid-cols-8">
                      <div className="md:col-span-2">
                        <label className="block mb-1 text-xs font-medium text-gray-600">Tên dịch vụ</label>
                        <div className="relative">
                          <textarea
                            ref={(el) => inputRefs.current[`item-${index}-name`] = el}
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            placeholder="Nhập tên dịch vụ..."
                            rows={3}
                            className="p-2 w-full text-xs rounded-lg border border-gray-200 transition-all duration-200 resize-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 placeholder:text-gray-400"
                            required
                            onFocus={() => setLastFocusedIndex(index)}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault();
                                inputRefs.current[`item-${index}-unit`]?.focus();
                              }
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">ĐVT</label>
                        <Input
                          ref={(el) => inputRefs.current[`item-${index}-unit`] = el}
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                          placeholder="Đơn vị"
                          className="h-7 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-yellow focus:ring-brand-yellow"
                          onKeyDown={(e) => {
                            if (e.key === 'Tab' && !e.shiftKey) {
                              e.preventDefault();
                              inputRefs.current[`item-${index}-quantity`]?.focus();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">SL</label>
                        <Input
                          ref={(el) => inputRefs.current[`item-${index}-quantity`] = el}
                          type="number"
                          min="1"
                          value={item.quantity || ""}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          onFocus={(e) => {
                            if (e.target.value === "0") {
                              e.target.value = "";
                            }
                            setLastFocusedIndex(index);
                          }}
                          placeholder="SL"
                          className="h-7 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-yellow focus:ring-brand-yellow"
                          onKeyDown={(e) => {
                            if (e.key === 'Tab' && !e.shiftKey) {
                              e.preventDefault();
                              inputRefs.current[`item-${index}-price`]?.focus();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">Đơn giá</label>
                        <Input
                          ref={(el) => inputRefs.current[`item-${index}-price`] = el}
                          type="number"
                          min="0"
                          value={item.price || ""}
                          onChange={(e) => handleItemChange(index, "price", e.target.value)}
                          onFocus={(e) => {
                            if (e.target.value === "0") {
                              e.target.value = "";
                            }
                            setLastFocusedIndex(index);
                          }}
                          placeholder="Giá"
                          className="h-7 text-xs rounded-lg border-gray-300 transition-all focus:border-brand-yellow focus:ring-brand-yellow"
                          onKeyDown={(e) => {
                            if (e.key === 'Tab' && !e.shiftKey) {
                              e.preventDefault();
                              inputRefs.current[`item-${index}-vat`]?.focus();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-xs font-medium text-gray-600">VAT</label>
                        <select
                          ref={(el) => inputRefs.current[`item-${index}-vat`] = el}
                          value={item.vatRate || 0}
                          onChange={(e) => handleItemChange(index, "vatRate", parseInt(e.target.value))}
                          className="px-2 py-1 w-full text-xs rounded-lg border border-gray-300 transition-all focus:border-brand-yellow focus:ring-brand-yellow"
                          onKeyDown={(e) => {
                            if (e.key === 'Tab' && !e.shiftKey) {
                              e.preventDefault();
                              if (index < formData.items.length - 1) {
                                inputRefs.current[`item-${index + 1}-name`]?.focus();
                              } else {
                                addItem();
                              }
                            }
                          }}
                        >
                          <option value={0}>Tự động (10%)</option>
                          <option value={8}>8%</option>
                          <option value={10}>10%</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <div className="p-1 w-full bg-brand-yellow/10 rounded-lg border border-brand-yellow/20">
                          <p className="text-xs text-brand-yellow">
                            <span className="font-medium">VAT:</span>
                            <span className="block font-semibold text-brand-yellow">
                              {(() => {
                                const vatInfo = calculateItemVat(item);
                                return vatInfo.rate > 0 ? `${vatInfo.rate}%` : '0%';
                              })()}
                            </span>
                          </p>
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-500 bg-red-50 rounded-lg transition-colors hover:bg-red-100"
                            title="Xóa dịch vụ"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Item Summary */}
                    <div className="p-2 space-y-1 bg-gradient-to-r from-brand-yellow/10 to-brand-green/10 rounded-lg border border-brand-yellow/20">
                      <div className="flex flex-wrap gap-3 justify-between items-center text-xs">
                        <span className="text-gray-700">
                          <span className="font-medium">Đơn giá:</span> 
                          <span className="ml-1 font-semibold text-brand-yellow">
                            {(parseInt(item.price) || 0).toLocaleString("vi-VN")} VNĐ
                          </span>
                        </span>
                        {(() => {
                          const vatInfo = calculateItemVat(item);
                          return vatInfo.rate > 0 ? (
                            <span className="text-gray-700">
                              <span className="font-medium">VAT {vatInfo.rate}%:</span> 
                              <span className="ml-1 font-semibold text-brand-green">
                                +{vatInfo.amount.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </span>
                          ) : null;
                        })()}
                        <span className="text-gray-700">
                          <span className="font-medium">Thành tiền:</span> 
                          <span className="ml-1 font-semibold text-brand-yellow">
                            {(item.total || 0).toLocaleString("vi-VN")} VNĐ
                          </span>
                        </span>
                        {(() => {
                          const vatInfo = calculateItemVat(item);
                          const totalVat = vatInfo.amount * (parseInt(item.quantity) || 0);
                          return vatInfo.rate > 0 ? (
                            <span className="text-gray-700">
                              <span className="font-medium">Tổng VAT:</span> 
                              <span className="ml-1 font-semibold text-brand-green">
                                +{totalVat.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </span>
                          ) : null;
                        })()}
                        <span className="text-gray-700">
                          <span className="font-medium">Tổng có VAT:</span> 
                          <span className="ml-1 font-semibold text-brand-green">
                            {calculateItemTotalWithVat(item).toLocaleString("vi-VN")} VNĐ
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary Section */}
            <div className="p-3 space-y-2 bg-gradient-to-br from-brand-green/10 to-brand-yellow/10 rounded-lg border border-brand-green/20 shadow-sm">
              <div className="flex gap-2 items-center">
                <div className="flex justify-center items-center w-6 h-6 bg-brand-green/10 rounded-lg">
                  <Calculator className="w-3 h-3 text-brand-green" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Tổng kết báo giá</h4>
              </div>
              
              <div className="space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-brand-green/20 shadow-sm">
                  <span className="text-xs font-medium text-gray-700">Tổng tiền hàng:</span>
                  <span className="text-xs font-semibold text-brand-green">
                    {totals.subtotal.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>

                {/* VAT Details */}
                {formData.vatEnabled && Object.keys(totals.vatDetails).length > 0 && (
                  <div className="space-y-1">
                    {Object.entries(totals.vatDetails).map(([rate, amount]) => (
                      <div key={rate} className="flex justify-between items-center p-2 bg-white rounded-lg border border-brand-green/20 shadow-sm">
                        <span className="text-xs font-medium text-gray-700">Thuế VAT {rate}%:</span>
                        <span className="text-xs font-semibold text-brand-green">
                          {amount.toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total VAT */}
                {formData.vatEnabled && totals.totalVat > 0 && (
                  <div className="flex justify-between items-center p-2 bg-brand-green/10 rounded-lg border border-brand-green/20 shadow-sm">
                    <span className="text-xs font-medium text-gray-700">Tổng thuế VAT:</span>
                    <span className="text-xs font-semibold text-brand-green">
                      {totals.totalVat.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                )}

                {/* Grand Total */}
                {formData.vatEnabled ? (
                  <div className="flex justify-between items-center p-2 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg border border-brand-green/20 shadow-sm">
                    <span className="text-sm font-semibold text-brand-green">Tổng cộng:</span>
                    <span className="text-sm font-bold text-brand-green">
                      {totals.total.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-2 bg-gradient-to-r from-brand-green/10 to-brand-yellow/10 rounded-lg border border-brand-green/20 shadow-sm">
                    <span className="text-sm font-semibold text-brand-green">Tổng cộng:</span>
                    <span className="text-sm font-bold text-brand-green">
                      {totals.subtotal.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                )}
              </div>

              {/* VAT Info */}
              {formData.vatEnabled && (
                <div className="p-2 rounded-lg border bg-brand-green/10 border-brand-green/20">
                  <p className="text-xs text-brand-green">
                    <span className="font-medium">💡 Hướng dẫn VAT:</span>
                    <span className="block mt-1">
                      • Chọn "Tự động (10%)" để áp dụng VAT 10% mặc định
                    </span>
                    <span className="block">
                      • Chọn "8%" hoặc "10%" để áp dụng VAT theo tỷ lệ cụ thể
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Notes */}
        {activeTab === 2 && (
          <div className="space-y-3">
            {/* Notes Section */}
            <div className="p-3 space-y-2 bg-white rounded-lg border shadow-sm transition-shadow border-brand-yellow/20 hover:shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="flex justify-center items-center w-6 h-6 rounded-lg bg-brand-yellow/10">
                    <FileText className="w-3 h-3 text-brand-yellow" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Ghi chú bổ sung</h4>
                </div>
                <button
                  type="button"
                  onClick={addNote}
                  className="flex gap-1 items-center px-3 py-1 text-xs text-white bg-gradient-to-r rounded-lg shadow-sm transition-all from-brand-yellow to-brand-yellow hover:shadow-md"
                >
                  <Plus className="w-3 h-3" />
                  Thêm
                </button>
              </div>
              <div className="space-y-2">
                {(formData.notes || []).map((note, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <label className="block mb-1 text-xs font-medium text-gray-700">
                        Ghi chú {index + 1}
                      </label>
                      <textarea
                        ref={(el) => inputRefs.current[`note-${index}`] = el}
                        value={note}
                        onChange={(e) => updateNote(index, e.target.value)}
                        rows={2}
                        className="px-2 py-1 w-full text-xs rounded-lg border border-gray-300 transition-all resize-none focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 placeholder:text-gray-400"
                        placeholder={`Nhập ghi chú ${index + 1}...`}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab' && !e.shiftKey) {
                            e.preventDefault();
                            if (index < (formData.notes || []).length - 1) {
                              inputRefs.current[`note-${index + 1}`]?.focus();
                            } else {
                              addNote();
                            }
                          }
                        }}
                      />
                    </div>
                    {(formData.notes || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNote(index)}
                        className="self-end p-1 text-red-500 bg-red-50 rounded-lg transition-colors hover:bg-red-100"
                        title="Xóa ghi chú"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 