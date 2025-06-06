'use client';

import { useEffect, useRef } from 'react';

const Map = ({ center, zoom, markers }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Khởi tạo map khi component mount
    if (!mapInstanceRef.current && mapRef.current) {
      // Thêm Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: center || { lat: 10.762622, lng: 106.660172 }, // Mặc định là TP.HCM
          zoom: zoom || 12,
        });

        // Thêm markers nếu có
        if (markers && markers.length > 0) {
          markers.forEach(marker => {
            new window.google.maps.Marker({
              position: marker.position,
              map: mapInstanceRef.current,
              title: marker.title,
            });
          });
        }
      };
    }
  }, [center, zoom, markers]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '400px' }}
      className="rounded-lg shadow-lg"
    />
  );
};

export default Map; 