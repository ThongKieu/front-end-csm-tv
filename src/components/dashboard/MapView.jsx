'use client';

import { useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Clock, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const unassignedIcon = createCustomIcon('#f59e0b'); // yellow
const assignedIcon = createCustomIcon('#10b981'); // green
const priorityIcon = createCustomIcon('#ef4444'); // red

// Component to fit map bounds to markers
function FitBounds({ markers }) {
  const map = useMap();
  
  useMemo(() => {
    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, markers]);

  return null;
}

export default function MapView({ assignedWorks, unassignedWorks, workers, onAssign, onEdit }) {
  const [selectedWork, setSelectedWork] = useState(null);

  // Process works data to create markers
  const { markers, bounds } = useMemo(() => {
    const allMarkers = [];
    const markerElements = [];

    // Process unassigned works
    if (unassignedWorks) {
      Object.entries(unassignedWorks).forEach(([category, works]) => {
        if (Array.isArray(works)) {
          works.forEach(work => {
            if (work.job_customer_address) {
              // Try to extract coordinates from address or use geocoding
              // For now, we'll use mock coordinates based on work ID
              const lat = 10.762622 + (work.job_id % 100) * 0.001;
              const lng = 106.660172 + (work.job_id % 100) * 0.001;
              
              const marker = L.marker([lat, lng], {
                icon: category === 'job_priority' ? priorityIcon : unassignedIcon
              });
              
              marker.work = {
                ...work,
                type: 'unassigned',
                category,
                coordinates: [lat, lng]
              };
              
              allMarkers.push(marker);
              markerElements.push(marker);
            }
          });
        }
      });
    }

    // Process assigned works
    if (assignedWorks && Array.isArray(assignedWorks)) {
      assignedWorks.forEach(category => {
        if (category.data && Array.isArray(category.data)) {
          category.data.forEach(work => {
            if (work.job_customer_address) {
              // Try to extract coordinates from address or use geocoding
              const lat = 10.762622 + (work.job_id % 100) * 0.001;
              const lng = 106.660172 + (work.job_id % 100) * 0.001;
              
              const marker = L.marker([lat, lng], {
                icon: assignedIcon
              });
              
              marker.work = {
                ...work,
                type: 'assigned',
                category: category.name,
                coordinates: [lat, lng]
              };
              
              allMarkers.push(marker);
              markerElements.push(marker);
            }
          });
        }
      });
    }

    return { markers: allMarkers, bounds: markerElements };
  }, [assignedWorks, unassignedWorks]);

  const handleMarkerClick = useCallback((work) => {
    setSelectedWork(work);
  }, []);

  const getStatusIcon = (work) => {
    if (work.type === 'unassigned') {
      return work.category === 'job_priority' ? 
        <AlertCircle className="w-4 h-4 text-red-500" /> : 
        <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = (work) => {
    if (work.type === 'unassigned') {
      return work.category === 'job_priority' ? 'Ưu tiên' : 'Chưa phân công';
    }
    return 'Đã phân công';
  };

  const getStatusColor = (work) => {
    if (work.type === 'unassigned') {
      return work.category === 'job_priority' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50';
    }
    return 'text-green-600 bg-green-50';
  };

  if (markers.length === 0) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <MapPin className="mx-auto mb-4 w-12 h-12 text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-600">
            Không có dữ liệu bản đồ
          </h3>
          <p className="text-sm text-gray-500">
            Chưa có công việc nào có địa chỉ để hiển thị trên bản đồ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[10.762622, 106.660172]} // TP.HCM center
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Fit bounds to markers */}
        <FitBounds markers={bounds} />
        
        {/* Render markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.work.coordinates}
            icon={marker.options.icon}
            eventHandlers={{
              click: () => handleMarkerClick(marker.work)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <div className="flex gap-2 items-center mb-2">
                  {getStatusIcon(marker.work)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(marker.work)}`}>
                    {getStatusText(marker.work)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex gap-2 items-center">
                    <User className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium">{marker.work.job_customer_name}</span>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span className="text-sm">{marker.work.job_customer_phone}</span>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <MapPin className="w-3 h-3 text-gray-500 mt-0.5" />
                    <span className="text-sm text-gray-600">{marker.work.job_customer_address}</span>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <FileText className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{marker.work.job_content}</span>
                  </div>
                  
                  {marker.work.worker_name && (
                    <div className="flex gap-2 items-center">
                      <User className="w-3 h-3 text-green-500" />
                      <span className="text-sm text-green-600">Thợ: {marker.work.worker_name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-3">
                  {marker.work.type === 'unassigned' && (
                    <button
                      onClick={() => onAssign && onAssign(marker.work)}
                      className="px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Phân công
                    </button>
                  )}
                  <button
                    onClick={() => onEdit && onEdit(marker.work)}
                    className="px-3 py-1 text-xs text-white bg-gray-500 rounded hover:bg-gray-600"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="mb-2 text-sm font-semibold">Chú thích</h4>
        <div className="space-y-1">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">Ưu tiên</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs">Chưa phân công</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Đã phân công</span>
          </div>
        </div>
      </div>
    </div>
  );
}
