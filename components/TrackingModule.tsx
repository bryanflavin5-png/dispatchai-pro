
import React, { useState, useEffect, useRef } from 'react';
import { Driver, Load, LoadStatus, DriverStatus, Geofence, GeofenceEvent } from '../types';
import { Truck, MapPin, Navigation, Map as MapIcon, History, AlertOctagon } from 'lucide-react';

// Declare Leaflet global
declare const L: any;

interface TrackingModuleProps {
  drivers: Driver[];
  loads: Load[];
  geofences: Geofence[];
  geofenceEvents: GeofenceEvent[];
}

export const TrackingModule: React.FC<TrackingModuleProps> = ({ drivers, loads, geofences, geofenceEvents }) => {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [showGeofences, setShowGeofences] = useState(true);
  const [activeTab, setActiveTab] = useState<'fleet' | 'geofences'>('fleet');
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const linesRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);

  const activeLoads = loads.filter(l => 
    l.status === LoadStatus.IN_TRANSIT && l.originCoords && l.destinationCoords
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center US
    const map = L.map(mapContainerRef.current).setView([39.8283, -98.5795], 4);

    // Use OpenStreetMap tiles (CartoDB Voyager for a cleaner look suitable for logistics)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Lines & Geofences
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old elements
    Object.values(markersRef.current).forEach((marker: any) => marker.remove());
    markersRef.current = {};
    linesRef.current.forEach(line => line.remove());
    linesRef.current = [];
    circlesRef.current.forEach(circle => circle.remove());
    circlesRef.current = [];

    // Draw active load routes
    activeLoads.forEach(load => {
      if(load.originCoords && load.destinationCoords) {
         const line = L.polyline([
           [load.originCoords.lat, load.originCoords.lng],
           [load.destinationCoords.lat, load.destinationCoords.lng]
         ], {
           color: '#3b82f6',
           weight: 3,
           opacity: 0.6,
           dashArray: '10, 10'
         }).addTo(map);
         linesRef.current.push(line);
      }
    });

    // Draw Geofences
    if (showGeofences) {
        geofences.forEach(geo => {
            let color = '#3b82f6'; // Default Blue
            if (geo.type === 'Shipper') color = '#10b981'; // Green
            if (geo.type === 'Receiver') color = '#f59e0b'; // Amber
            if (geo.type === 'Restricted') color = '#ef4444'; // Red

            const circle = L.circle([geo.coordinates.lat, geo.coordinates.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                radius: geo.radius,
                weight: 1
            }).addTo(map);
            
            circle.bindTooltip(`
                <div class="font-bold">${geo.name}</div>
                <div class="text-xs text-slate-500">${geo.type}</div>
            `, { permanent: false, direction: 'top' });

            circlesRef.current.push(circle);
        });
    }

    // Draw Drivers
    drivers.forEach(driver => {
      const isSelected = selectedDriver === driver.id;
      const isActive = driver.status === DriverStatus.ON_LOAD;

      // Custom DivIcon for the marker
      const colorClass = isActive ? 'bg-blue-600' : 'bg-green-500';
      const pulseHtml = isActive ? `<span class="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></span>` : '';
      
      const icon = L.divIcon({
        className: 'custom-driver-icon',
        html: `
          <div class="relative w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-lg ${colorClass} transition-transform ${isSelected ? 'scale-125' : ''}">
             <div class="text-white text-xs">🚛</div>
             ${pulseHtml}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([driver.coordinates.lat, driver.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => setSelectedDriver(driver.id));

      markersRef.current[driver.id] = marker;
    });

  }, [drivers, loads, selectedDriver, showGeofences, geofences]);

  // Fly to driver when selected via sidebar
  useEffect(() => {
    if (selectedDriver && mapInstanceRef.current && markersRef.current[selectedDriver]) {
      const driver = drivers.find(d => d.id === selectedDriver);
      if (driver) {
        mapInstanceRef.current.flyTo([driver.coordinates.lat, driver.coordinates.lng], 10, {
          duration: 1.5
        });
      }
    }
  }, [selectedDriver]);

  const getGeofenceColor = (type: string) => {
    switch(type) {
        case 'Yard': return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'Shipper': return 'text-green-600 bg-green-50 border-green-200';
        case 'Receiver': return 'text-amber-600 bg-amber-50 border-amber-200';
        case 'Restricted': return 'text-red-600 bg-red-50 border-red-200';
        default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
       {/* Header */}
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Live Fleet Tracking & Geofencing</h2>
        <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <input 
                    type="checkbox" 
                    checked={showGeofences} 
                    onChange={(e) => setShowGeofences(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-sm font-medium text-slate-700">Show Geofences</span>
            </label>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Map Container */}
        <div className="lg:col-span-3 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden shadow-md z-0">
           <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ zIndex: 0 }} />
           
           {/* Map Overlay Stats */}
           <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur shadow-lg rounded-lg p-3 border border-slate-200 text-xs">
                <div className="font-bold text-slate-700 mb-2">Map Legend</div>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Driver (On Load)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Driver (Available)</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-blue-500 bg-blue-500/20"></span> Yard</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-green-500 bg-green-500/20"></span> Shipper</div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full border border-red-500 bg-red-500/20"></span> Restricted Zone</div>
                </div>
           </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
           <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('fleet')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'fleet' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Fleet
                </button>
                <button 
                    onClick={() => setActiveTab('geofences')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'geofences' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Geofence Logs
                </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-2">
              {activeTab === 'fleet' ? (
                  <div className="space-y-2">
                    {drivers.map(driver => (
                        <div 
                        key={driver.id}
                        onClick={() => setSelectedDriver(driver.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedDriver === driver.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:border-blue-200'
                        }`}
                        >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={driver.avatar} className="w-10 h-10 rounded-full bg-slate-200" alt={driver.name} />
                                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                                driver.status === DriverStatus.AVAILABLE ? 'bg-green-500' : 
                                driver.status === DriverStatus.ON_LOAD ? 'bg-blue-600' : 'bg-slate-400'
                                }`}></span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{driver.name}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                <MapPin size={10} /> {driver.currentLocation}
                                </p>
                            </div>
                        </div>
                        
                        {/* Driver Details if selected */}
                        {selectedDriver === driver.id && (
                            <div className="mt-3 pt-3 border-t border-slate-200/50 text-xs space-y-1">
                                <div className="flex justify-between text-slate-500">
                                <span>Truck ID:</span>
                                <span className="font-mono text-slate-700">{driver.truckId}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                <span>Phone:</span>
                                <span className="text-slate-700">{driver.phone}</span>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="space-y-3 p-2">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Events</h4>
                     {geofenceEvents.map(evt => {
                         const driver = drivers.find(d => d.id === evt.driverId);
                         const fence = geofences.find(g => g.id === evt.geofenceId);
                         return (
                            <div key={evt.id} className="flex gap-3 relative pb-4 last:pb-0">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${evt.event === 'Entry' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                    <div className="w-px h-full bg-slate-100 my-1 last:hidden"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-700">{evt.timestamp}</span>
                                        <span className={`text-[10px] px-1.5 rounded border font-medium ${evt.event === 'Entry' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {evt.event.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-800">
                                        <span className="font-semibold">{driver?.name}</span> {evt.event === 'Entry' ? 'arrived at' : 'departed from'} <span className="font-semibold">{fence?.name}</span>
                                    </p>
                                    {fence && (
                                        <div className={`mt-1 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${getGeofenceColor(fence.type)}`}>
                                            <Navigation size={10} /> {fence.type}
                                        </div>
                                    )}
                                </div>
                            </div>
                         );
                     })}
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
