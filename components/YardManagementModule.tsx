
import React, { useState } from 'react';
import { YardSpot, Trailer } from '../types';
import { Warehouse, Truck, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { StatCard } from './StatCard';

interface YardManagementModuleProps {
  spots: YardSpot[];
  trailers: Trailer[];
}

export const YardManagementModule: React.FC<YardManagementModuleProps> = ({ spots, trailers }) => {
  const [filter, setFilter] = useState<'All' | 'Empty' | 'Loaded' | 'Repair'>('All');

  const totalSpots = spots.length;
  const occupiedSpots = spots.filter(s => s.occupied).length;
  const utilization = Math.round((occupiedSpots / totalSpots) * 100);
  const repairUnits = trailers.filter(t => t.status === 'Repair').length;

  const getTrailerColor = (status: string) => {
      switch(status) {
          case 'Loaded': return 'bg-green-100 border-green-300 text-green-800';
          case 'Empty': return 'bg-blue-100 border-blue-300 text-blue-800';
          case 'Repair': return 'bg-red-100 border-red-300 text-red-800';
          default: return 'bg-slate-100 border-slate-300 text-slate-800';
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Terminal Yard Management (YMS)</h2>
           <p className="text-sm text-slate-500">Chicago Main Terminal - Zone A</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Warehouse size={16} /> Yard Layout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Yard Utilization" 
          value={`${utilization}%`} 
          icon={<Warehouse size={24} className="text-blue-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Trailers on Yard" 
          value={occupiedSpots} 
          icon={<Truck size={24} className="text-slate-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Red Tagged (Repair)" 
          value={repairUnits} 
          icon={<AlertTriangle size={24} className="text-red-600" />} 
          colorClass={repairUnits > 0 ? "bg-red-50 border-red-100" : "bg-white"}
        />
        <StatCard 
          title="Available Empties" 
          value={trailers.filter(t => t.status === 'Empty').length} 
          icon={<CheckCircle size={24} className="text-green-600" />} 
          colorClass="bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-700">Live Yard Map</h3>
              <div className="flex gap-2 text-sm">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Loaded</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> Empty</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Repair</div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Docks Section */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Loading Docks</h4>
                  <div className="flex flex-col gap-2">
                      {spots.filter(s => s.type === 'Dock').map(spot => {
                          const trailer = trailers.find(t => t.id === spot.trailerId);
                          return (
                              <div key={spot.id} className="flex h-24 border-2 border-dashed border-slate-300 rounded-lg bg-white relative">
                                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-200 flex items-center justify-center border-r border-slate-200 text-xs font-bold text-slate-600 rotate-180" style={{writingMode: 'vertical-rl'}}>
                                      {spot.name}
                                  </div>
                                  <div className="flex-1 p-2 flex items-center justify-center">
                                      {trailer ? (
                                          <div className={`w-full h-full rounded border-2 ${getTrailerColor(trailer.status)} flex flex-col items-center justify-center p-2 shadow-sm`}>
                                              <div className="font-bold text-sm">{trailer.number}</div>
                                              <div className="text-xs opacity-75">{trailer.type}</div>
                                              {trailer.contents && <div className="text-[10px] mt-1 text-center leading-tight bg-white/50 px-1 rounded">{trailer.contents}</div>}
                                          </div>
                                      ) : (
                                          <span className="text-xs text-slate-300 font-medium">OPEN</span>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* Parking Section */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Trailer Parking (Row 100)</h4>
                  <div className="grid grid-cols-2 gap-4">
                      {spots.filter(s => s.type === 'Parking').map(spot => {
                           const trailer = trailers.find(t => t.id === spot.trailerId);
                           return (
                               <div key={spot.id} className="aspect-square border-2 border-slate-300 rounded-lg bg-white relative p-2 flex flex-col items-center justify-center">
                                   <div className="absolute top-1 right-2 text-[10px] font-bold text-slate-400">{spot.name}</div>
                                   {trailer ? (
                                        <div className={`w-full h-4/5 rounded border ${getTrailerColor(trailer.status)} flex flex-col items-center justify-center p-1 shadow-sm`}>
                                            <div className="font-bold text-sm">{trailer.number}</div>
                                            <div className="text-[10px] opacity-75">{trailer.status}</div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-300 font-medium">EMPTY</span>
                                    )}
                               </div>
                           )
                      })}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
