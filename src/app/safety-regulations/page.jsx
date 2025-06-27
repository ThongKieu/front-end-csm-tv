'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Shield, Zap, Flame, ArrowUp, Users, FileText, Heart } from 'lucide-react';

export default function SafetyRegulationsPage() {
  const [activeSection, setActiveSection] = useState('dieu1');
  const [expandedSections, setExpandedSections] = useState({
    dieu1: true,
    dieu2: false,
    tinhHuong: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://thoviet.com.vn/wp-content/uploads/2023/03/cropped-Logo-Tho-Viet-bg-3.png"
                alt="Thợ Việt Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-800">Quy Định An Toàn Lao Động</h1>
                <p className="text-sm text-gray-600">Công Ty TNHH Dịch Vụ Kỹ Thuật Thợ Việt</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => setExpandedSections(prev => ({ ...prev, mobileMenu: !prev.mobileMenu }))}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className={`mt-3 ${expandedSections.mobileMenu ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-wrap gap-2 lg:gap-4">
              <button
                onClick={() => scrollToSection('dieu1')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'dieu1'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Shield className="inline w-4 h-4 mr-1" />
                Điều 1: Đào Tạo
              </button>
              <button
                onClick={() => scrollToSection('dieu2')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'dieu2'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className="inline w-4 h-4 mr-1" />
                Điều 2: Sơ Cứu
              </button>
              <button
                onClick={() => scrollToSection('tinhHuong')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === 'tinhHuong'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlertTriangle className="inline w-4 h-4 mr-1" />
                Tình Huống
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800">Bên A: CÔNG TY TNHH DỊCH VỤ KỸ THUẬT THỢ VIỆT</h2>
              <div className="space-y-1 text-gray-600">
                <p>MSDN: 0311158568</p>
                <p>ĐC: 25/6 Phùng Văn Cung, Phường 2, Q. Phú Nhuận, TP.HCM</p>
                <p>Website: www.thoviet.com.vn</p>
                <p>Email: info@thoviet.com.vn</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-blue-800">Bên B: Người lao động</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <section id="dieu1" className="mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 cursor-pointer"
              onClick={() => toggleSection('dieu1')}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="w-6 h-6 mr-3" />
                  ĐIỀU 1: ĐÀO TẠO KIẾN THỨC AN TOÀN LAO ĐỘNG
                </h2>
                {expandedSections.dieu1 ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
              </div>
            </div>
            
            {expandedSections.dieu1 && (
              <div className="p-6 space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Bên B đã được Bên A đào tạo, huấn luyện các kiến thức an toàn lao động sau đây:
                </p>

                {/* Safety Categories */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Protection */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      1. An Toàn Bảo Hộ Che Chắn, Bảo Hộ Cá Nhân
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Trang bị đầy đủ đồ bảo hộ lao động: đeo kính, giầy, nón bảo hộ
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Sử dụng máy cắt phải có nắp che chắn máy, kính bảo hộ
                      </li>
                    </ul>
                  </div>

                  {/* Electrical Safety */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      2. An Toàn Điện – Sử Dụng Thiết Bị Điện
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Chỉ thi công điện khi có kiến thức về điện
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Trang bị bút thử điện, CB chống dòng rò RCBO
                      </li>
                    </ul>
                  </div>

                  {/* Fire Safety */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
                      <Flame className="w-5 h-5 mr-2" />
                      3. An Toàn Lửa – Hàn Cắt
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Cấm hút thuốc, dùng lửa gần xăng, dầu, chất dễ cháy
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Có biện pháp che chắn, trang bị bạt PCCC
                      </li>
                    </ul>
                  </div>

                  {/* Height Safety */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                      <ArrowUp className="w-5 h-5 mr-2" />
                      4. An Toàn Leo Trèo, Làm Việc Trên Cao
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Trang thiết bị đảm bảo an toàn: dây đeo bảo hộ toàn thân
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Dựng giàn giáo cao trên 02 mét bắt buộc đội nón bảo hộ
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Warning Section */}
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800 mb-2">Cảnh báo tình huống tai nạn:</h4>
                      <ul className="space-y-1 text-red-700">
                        <li>• Đã có trường hợp cắt gạch bị gạch bắn vào mắt gây chấn thương</li>
                        <li>• Máy cắt gỗ gây giật vào người gây thương tích</li>
                        <li>• Đạp đinh lũng chân do không mang giầy bảo hộ</li>
                        <li>• Máy hàn ppr rò điện gây giật nhưng nhờ có CB chống rò tắt kịp thời</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 2 */}
        <section id="dieu2" className="mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-600 to-green-700 p-6 cursor-pointer"
              onClick={() => toggleSection('dieu2')}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Heart className="w-6 h-6 mr-3" />
                  ĐIỀU 2: KIẾN THỨC SƠ CẤP CỨU TAI NẠN ĐIỆN
                </h2>
                {expandedSections.dieu2 ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
              </div>
            </div>
            
            {expandedSections.dieu2 && (
              <div className="p-6 space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  Bên B đã được Bên A hướng dẫn các quy trình sơ cấp cứu tai nạn điện như sau:
                </p>

                {/* Emergency Steps */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-800 mb-3">1. Cần làm gì để cấp cứu người bị điện giật?</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                        <p className="text-gray-700">Ngắt cầu dao điện, rút chui điện</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                        <p className="text-gray-700">Dùng vật cách điện như cây khô, nhựa mũ... tách dòng điện ra khỏi nạn nhân</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-orange-800 mb-3">2. Cấp cứu người bị điện giật</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                        <p className="text-gray-700">Đặt nạn nhân nằm ngửa, chỗ khô ráo thoáng khí</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                        <p className="text-gray-700">Nới rộng quần áo, dây thắt lưng</p>
                      </div>
                      <div className="flex items-start">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                        <p className="text-gray-700">Tiến hành hồi sức tim phổi cho nạn nhân</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Motto */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
                  <div className="space-y-2">
                    <p className="text-xl font-bold">CÓ AN TOÀN – MỚI THI CÔNG</p>
                    <p className="text-lg">CÓ LAO ĐỘNG – NGHĨ TỚI BẢN THÂN, GIA ĐÌNH</p>
                    <p className="text-lg">CÓ SỨC KHOẺ - MỚI CÓ TIỀN</p>
                    <p className="text-lg">CÓ SỨC KHOẺ - CÓ TƯƠNG LAI</p>
                    <p className="text-lg">CÓ SỨC KHOẺ - CÓ GIA ĐÌNH HẠNH PHÚC</p>
                    <p className="text-sm opacity-90">(Quản trị rủi ro – nhìn thấy, nhận biết các rủi ro, mối nguy hại – đề ra phương án xử lý)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3 - Situations */}
        <section id="tinhHuong" className="mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-600 to-red-700 p-6 cursor-pointer"
              onClick={() => toggleSection('tinhHuong')}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3" />
                  MỘT SỐ HÌNH ẢNH, TÌNH HUỐNG KHÔNG AN TOÀN LAO ĐỘNG
                </h2>
                {expandedSections.tinhHuong ? <ChevronUp className="w-6 h-6 text-white" /> : <ChevronDown className="w-6 h-6 text-white" />}
              </div>
            </div>
            
            {expandedSections.tinhHuong && (
              <div className="p-6 space-y-6">
                {/* Situation Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-red-800 mb-3">1. Tình huống: Lan can đặt dàn nóng máy lạnh</h3>
                    <p className="text-gray-700 mb-3">
                      Không có khung che chắn, đi ra ngoài lan can nhưng không đeo dây bảo hộ toàn thân, 
                      không có dây dù cứu sinh để vệ sinh máy lạnh sẽ rủi ro không an toàn, nguy hiểm.
                    </p>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800">Yêu cầu:</p>
                      <p className="text-sm text-gray-700">
                        Đeo dây bảo hộ toàn thân, dây dù cứu sinh, đội nón bảo hiểm mới ra ngoài vệ sinh, 
                        sửa chữa máy lạnh, đề phòng tình huống mưa trơn trợt, dàn nóng máy lạnh bị rò điện.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <h3 className="text-lg font-bold text-orange-800 mb-3">2. Tình huống: Vệ sinh bể nước sinh hoạt</h3>
                    <p className="text-gray-700 mb-3">
                      Bể nước sinh hoạt nhưng ống nước thải chảy vô làm bể rất hôi, có khí độc, 
                      thợ xuống bể thấy nóng mặt, ngộp, phải chạy lên liền.
                    </p>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800">Yêu cầu:</p>
                      <p className="text-sm text-gray-700">
                        Dùng quạt hút khí độc ra ngoài, xịt nước sạch xung quanh bể, thổi khí tươi vào, 
                        đo khí, mặc dây bảo hộ toàn thân, dây dù cứu sinh mới được leo xuống bể.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Situations */}
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <h3 className="text-lg font-bold text-yellow-800 mb-3">3. Tình huống: Sử dụng thang máy vận chuyển đồ</h3>
                  <p className="text-gray-700 mb-3">
                    Khi sử dụng thang máy để vận chuyển đồ, đặc biệt là kính trong suốt, cần phải hết sức cẩn thận. 
                    Cảm biến cửa không thể nhận biết được vật cản, do đó cửa có thể tự động đóng lại và gây kẹt.
                  </p>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">Lưu ý:</p>
                    <p className="text-sm text-gray-700">
                      Tránh sử dụng các đồ vật nhỏ để chặn cửa, vì nếu không có cảm biến ở dưới chân cửa, 
                      tình trạng kẹt sẽ xảy ra. Đã có nhiều trường hợp sự cố tương tự.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Thông Tin, Luật An Toàn, Vệ Sinh Lao Động</h3>
            <p className="text-gray-600">
              Bên B đã được Bên A đào tạo về luật an toàn vệ sinh lao động.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://www.facebook.com/antoanlaodongvn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Facebook An Toàn Lao Động
              </a>
              <a 
                href="https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Luat-an-toan-ve-sinh-lao-dong-2015-281961.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Luật An Toàn Vệ Sinh Lao Động
              </a>
            </div>
            <p className="text-sm text-red-600 font-semibold">
              Luật an toàn vệ sinh lao động số: 84/2015/QH13 ngày 25 tháng 06 năm 2015
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
} 