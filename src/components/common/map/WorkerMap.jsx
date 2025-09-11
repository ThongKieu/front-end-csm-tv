'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WorkerMap = ({ worker, location }) => {
  if (!location) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Chưa có dữ liệu vị trí</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[location.latitude || 10.762622, location.longitude || 106.660172]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={[location.latitude, location.longitude]}
      >
        <Popup>
          <div className="text-sm">
            <p className="font-medium">{worker.worker_full_name}</p>
            <p className="text-gray-500">
              {new Date(location.last_update).toLocaleString()}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default WorkerMap; 