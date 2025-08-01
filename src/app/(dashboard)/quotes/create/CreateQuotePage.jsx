"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Save, Send, DollarSign } from "lucide-react";
import QuoteForm from "@/components/quotes/QuoteForm";
import QuotePreview from "@/components/quotes/QuotePreview";
import { useQuoteForm } from "@/hooks/useQuoteForm";

export default function CreateQuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    formData,
    calculateTotal,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit,
  } = useQuoteForm();

  const onSubmit = async (quoteData) => {
    setIsSubmitting(true);
    try {
    
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] bg-gray-50">
      {/* Main Content */}
      <div className="flex overflow-hidden flex-1">
        {/* Left Column - Form */}
        <div className="w-1/2 bg-white border-r border-gray-200">
          <QuoteForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleItemChange={handleItemChange}
            addItem={addItem}
            removeItem={removeItem}
          />
        </div>

        {/* Right Column - Preview */}
        <div className="w-1/2 bg-gray-50">
          <div className="overflow-y-auto h-full">
            <QuotePreview formData={formData} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex gap-3 justify-end items-center px-6 py-3">
          <div className="flex gap-2 items-center px-3 py-1.5 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">
              Tổng: {calculateTotal().toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-3 py-1.5 text-xs text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:scale-105"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex gap-1.5 items-center px-3 py-1.5 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-600 hover:scale-105 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3 h-3" />
            {isSubmitting ? "Đang lưu..." : "Lưu báo giá"}
          </button>
          <button
            type="button"
            className="flex gap-1.5 items-center px-3 py-1.5 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 hover:scale-105 text-xs"
          >
            <Send className="w-3 h-3" />
            Gửi cho khách
          </button>
        </div>
      </div>
    </div>
  );
} 