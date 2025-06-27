import { useState } from "react";

export const useQuoteForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    validUntil: "",
    items: [{ name: "", quantity: "", price: "", total: 0, unit: "", notes: "", vatRate: 0 }],
    notes: [""],
    subject: "",
    representativeName: "Kiều Nhất Thống",
    representativePosition: "Nhân Viên Kinh Doanh",
    representativeEmail: "lienhe@thoviet.com.vn",
    representativePhone: "0912 847 218",
    vatEnabled: true,
    companySlogan: "THỢ VIỆT NGƯỜI THỢ CỦA GIA ĐÌNH VIỆT SINCE 2011",
    companyServices: "DỊCH VỤ SỬA NHÀ - LẮP ĐẶT - SỬA CHỮA ĐIỆN NƯỚC - ĐIỆN LẠNH - ĐỒ GỖ",
    introduction: "Công ty Thợ Việt rất vui khi nhận được yêu cầu của Quý công ty. Chúng tôi hân hạnh gửi đến Quý Công ty bảng báo giá sau:",
    terms: [
      "Báo giá có giá trị trong 20 ngày.",
      "Báo giá theo điều kiện khảo sát thực tế."
    ],
    closing: "Xin cám ơn sự quan tâm của Quý khách hàng, rất mong được hợp tác lâu dài với Quý khách hàng.",
    date: new Date().toLocaleDateString('vi-VN'),
  });

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateVatTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + ((item.total || 0) * (item.vatRate || 0) / 100);
    }, 0);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "price") {
      const quantity = field === "quantity" ? value : newItems[index].quantity;
      const price = field === "price" ? value : newItems[index].price;
      
      // Convert to numbers for calculation, but keep as string for display
      const quantityNum = parseInt(quantity) || 0;
      const priceNum = parseInt(price) || 0;
      newItems[index].total = quantityNum * priceNum;
    }

    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: "", price: "", total: 0, unit: "", notes: "", vatRate: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (onSubmit) => {
    const totalAmount = calculateTotal();
    const vatTotal = calculateVatTotal();
    onSubmit({
      ...formData,
      totalAmount,
      vatTotal,
      quoteNumber: `BG-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 1000)
      ).padStart(3, "0")}`,
    });
  };

  return {
    formData,
    setFormData,
    calculateTotal,
    calculateVatTotal,
    handleInputChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit,
  };
}; 