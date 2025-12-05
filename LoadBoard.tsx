
import React, { useState } from 'react';
import { Load, LoadStatus, Driver, DriverStatus } from '../types';
import { MapPin, DollarSign, Truck, Package, FileText, Flame, Calendar, Clock, BarChart, CheckCircle } from 'lucide-react';

interface LoadBoardProps {
  loads: Load[];
  drivers: Driver[];
  onAssign: (loadId: string, driverId: string) => void;
}

export const LoadBoard: React.FC<LoadBoardProps> = ({ loads, drivers, onAssign }) => {
  const [viewMode, setViewMode] = useState<'card' | 'timeline'>('card');
  const [selectedLoad, setSelectedLoad] = useState<string | null>(null);

  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case LoadStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LoadStatus.DISPATCHED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LoadStatus.IN_TRANSIT: return 'bg-purple-100 text-purple-700 border-purple-200';
      case LoadStatus.DELIVERED: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const availableDrivers = drivers.filter(d => d.status === DriverStatus.AVAILABLE);

  // Smart Matching Logic (Mock)
  const getSmartMatchScore = (driver: Driver, load: Load) => {
    // In a real app, calculate actual distance and HOS availability
    let score = 70; 
    if (driver.currentLocation.includes(load.origin.split(',')[0])) score += 20; // Close to origin
    if (driver.hos.driveTimeRemaining > 480) score += 10; // Plenty of hours
    if (load.hazmat && !driver.hazmatEndorsed) score = 0; // DQ
    return score;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Dispatch Board</h2>
            <p className="text-sm text-slate-500">Manage loads, assignments, and schedules</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1 border border-slate-200 flex">
                <button 
                    onClick={() => setViewMode('card')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'card' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <div className="flex items-center gap-2"><FileText size={14} /> Cards</div>
                </button>
                <button 
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'timeline' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                    <div className="flex items-center gap-2"><Calendar size={14} /> Timeline</div>
                </button>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Truck size={16} />
            New Load
            </button>
        </div>
      </div>

      {viewMode === 'timeline' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Driver Schedule (Next 24h)</h3>
                  <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> Scheduled</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Available</div>
                  </div>
              </div>
              <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                      {/* Timeline Header */}
                      <div className="flex border-b border-slate-200">
                          <div className="w-48 p-3 border-r border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase">Driver</div>
                          {Array.from({length: 12}).map((_, i) => (
                              <div key={i} className="flex-1 border-r border-slate-100 p-2 text-center text-xs text-slate-400">
                                  {i*2}:00
                              </div>
                          ))}
                      </div>
                      {/* Timeline Rows */}
                      {drivers.map(driver => (
                          <div key={driver.id} className="flex border-b border-slate-100 h-16 hover:bg-slate-50">
                              <div className="w-48 p-3 border-r border-slate-200 flex items-center gap-2">
                                  <img src={driver.avatar} className="w-8 h-8 rounded-full" />
                                  <div>
                                      <div className="font-bold text-sm text-slate-800">{driver.name}</div>
                                      <div className="text-xs text-slate-500">{driver.currentLocation}</div>
                                  </div>
                              </div>
                              <div className="flex-1 relative">
                                  {/* Mock Bars */}
                                  {driver.status === DriverStatus.ON_LOAD && (
                                      <div className="absolute top-3 bottom-3 left-[10%] w-[40%] bg-blue-100 border border-blue-300 rounded-md flex items-center px-2 text-xs text-blue-800 truncate cursor-pointer hover:bg-blue-200">
                                          Load #{loads.find(l => l.assignedDriverId === driver.id)?.id}
                                      </div>
                                  )}
                                  {driver.status === DriverStatus.AVAILABLE && (
                                      <div className="absolute top-3 bottom-3 left-0 w-full border-2 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                                          Available
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 gap-4">
            {loads.map((load) => (
            <div 
                key={load.id} 
                className={`bg-white rounded-xl p-5 border transition-all duration-200 ${selectedLoad === load.id ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-slate-200 shadow-sm hover:border-blue-300'}`}
            >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Load Info */}
                <div className="flex-1">
                    <div className="flex items-center justify-between md:justify-start gap-3 mb-3">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-slate-500">{load.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(load.status)}`}>
                            {load.status}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">{load.customer}</span>
                        {load.hazmat && (
                            <div className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 text-xs font-bold uppercase" title={`Class ${load.hazmat.class} - UN${load.hazmat.unNumber}`}>
                                <Flame size={12} /> HAZMAT {load.hazmat.class}
                            </div>
                        )}
                    </div>
                    {/* Documents Section (McLeod Feature) */}
                    <div className="flex gap-1">
                        {load.documents.map((doc, idx) => (
                            <div key={idx} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                doc.status === 'Missing' ? 'bg-red-50 text-red-600 border-red-100' :
                                doc.status === 'Uploaded' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-green-50 text-green-600 border-green-100'
                            }`}>
                                <FileText size={10} /> {doc.type}
                            </div>
                        ))}
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                        <div className="mt-1 min-w-[16px]"><div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-100"></div></div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">ORIGIN</p>
                            <p className="text-sm font-semibold text-slate-900">{load.origin}</p>
                            <p className="text-xs text-slate-400">{load.pickupDate}</p>
                        </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                        <div className="mt-1 min-w-[16px]"><MapPin size={14} className="text-red-500" /></div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">DESTINATION</p>
                            <p className="text-sm font-semibold text-slate-900">{load.destination}</p>
                            <p className="text-xs text-slate-400">{load.deliveryDate}</p>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <Package size={14} /> {load.commodity}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <DollarSign size={14} /> ${load.rate.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        <Truck size={14} /> {load.weight.toLocaleString()} lbs
                    </span>
                    </div>
                </div>

                {/* Assignment Section */}
                <div className="md:w-72 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                    {load.status === LoadStatus.PENDING ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Smart Match</label>
                             {selectedLoad === load.id && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">AI Optimized</span>}
                        </div>
                        <div className="relative">
                        {selectedLoad === load.id ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {availableDrivers.length > 0 ? (
                                availableDrivers
                                .sort((a,b) => getSmartMatchScore(b, load) - getSmartMatchScore(a, load))
                                .map(driver => {
                                    const score = getSmartMatchScore(driver, load);
                                    return (
                                        <button
                                            key={driver.id}
                                            onClick={() => {
                                            onAssign(load.id, driver.id);
                                            setSelectedLoad(null);
                                            }}
                                            className="w-full flex items-center justify-between p-2 hover:bg-blue-50 text-left rounded-lg text-sm border border-slate-200 hover:border-blue-200 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                                <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{driver.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <span className={`text-[10px] font-bold px-1 rounded ${score > 80 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                        {score}% Match
                                                    </span>
                                                    {load.hazmat && !driver.hazmatEndorsed && (
                                                        <span className="text-[9px] text-red-500 font-bold border border-red-200 px-1 rounded bg-red-50">NO HAZMAT</span>
                                                    )}
                                                </div>
                                            </div>
                                            </div>
                                            <span className={`font-medium text-xs ${load.hazmat && !driver.hazmatEndorsed ? 'text-slate-300' : 'text-blue-600'}`}>Assign</span>
                                        </button>
                                    )
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic p-2">No drivers available</p>
                            )}
                            <button 
                                onClick={() => setSelectedLoad(null)}
                                className="text-xs text-slate-400 hover:text-slate-600 w-full text-center mt-1"
                            >
                                Cancel
                            </button>
                            </div>
                        ) : (
                            <button
                            onClick={() => setSelectedLoad(load.id)}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                            >
                            Select Driver
                            </button>
                        )}
                        </div>
                    </div>
                    ) : (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">Assigned To</p>
                        {drivers.find(d => d.id === load.assignedDriverId) && (
                        <div className="flex items-center gap-2">
                            <img 
                                src={drivers.find(d => d.id === load.assignedDriverId)?.avatar} 
                                alt="Driver" 
                                className="w-8 h-8 rounded-full border border-white shadow-sm"
                            />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{drivers.find(d => d.id === load.assignedDriverId)?.name}</p>
                                <p className="text-xs text-slate-500">{drivers.find(d => d.id === load.assignedDriverId)?.truckId}</p>
                            </div>
                        </div>
                        )}
                    </div>
                    )}
                </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};
