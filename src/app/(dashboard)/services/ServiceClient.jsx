"use client";

import { useState, useEffect } from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { ArrowRight, Percent, Search } from "lucide-react";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ServiceClient() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, servicesRes] = await Promise.all([
          fetch('https://csm.thoviet.net/api/web/hot-ser/cat'),
          fetch('https://csm.thoviet.net/api/web/hot-ser')
        ]);
        
        const categoriesData = await categoriesRes.json();
        const servicesData = await servicesRes.json();
        
        // Đảm bảo categoriesData là một mảng
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error('Categories data is not an array:', categoriesData);
          setCategories([]);
        }

        // Đảm bảo servicesData là một mảng
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else {
          console.error('Services data is not an array:', servicesData);
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lấy services cho category hiện tại
  const getCurrentCategoryServices = () => {
    if (!categories[selectedIndex] || !services.length) return [];
    
    const currentCategory = categories[selectedIndex];
    const categoryServices = services.find(cat => cat.id === currentCategory.id);
    
    if (!categoryServices || !categoryServices.hotser) return [];
    
    return categoryServices.hotser.filter(service => 
      service.title_hot.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredServices = getCurrentCategoryServices();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu dịch vụ
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Dịch vụ</h1>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <div className="border-b border-gray-100">
            <TabList className="flex space-x-1 p-1 max-w-full overflow-x-auto">
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  className={({ selected }) =>
                    classNames(
                      'px-4 py-2 text-sm font-medium whitespace-nowrap',
                      'focus:outline-none',
                      selected
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    )
                  }
                >
                  {category.title_cate_hot}
                </Tab>
              ))}
            </TabList>
          </div>

          <TabPanels>
            {categories.map((category) => (
              <TabPanel key={category.id} className="p-4">
                {filteredServices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Không tìm thấy dịch vụ nào
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="relative h-32 bg-gray-100">
                          <Image
                            src={`https://csm.thoviet.net/${service.image_hot}`}
                            alt={service.title_hot}
                            fill
                            className="object-cover"
                          />
                          {category.id === 1 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                              KM
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {service.title_hot}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            <a
                              href={service.url_hot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              <span>Chi tiết</span>
                              <ArrowRight className="w-3 h-3" />
                            </a>
                            {category.id === 1 && (
                              <div className="flex items-center gap-1 text-red-500">
                                <Percent className="w-3 h-3" />
                                <span className="text-xs font-medium">Giảm giá</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </>
  );
} 