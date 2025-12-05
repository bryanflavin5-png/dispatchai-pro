
import React, { useState } from 'react';
import { Driver, DriverStatus } from '../types';
import { Phone, MapPin, Truck, MoreHorizontal, Fuel, Plus, Edit2, XCircle } from 'lucide-react';

interface DriverListProps {
  drivers: Driver[];
}

export const DriverList: React.FC<DriverListProps> = ({ drivers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver> | null>(null);

  const getStatusBadge = (status: DriverStatus) => {
    switch (status) {
      case DriverStatus.AVAILABLE:
        return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-200">Available</span>;
      case DriverStatus.ON_LOAD:
        return <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full border border-blue-200">On Load</span>;
      case DriverStatus.OFF_DUTY:
        return <span className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full border border-slate-200">Off Duty</span>;
      case DriverStatus.MAINTENANCE:
        return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full border border-red-200">Maintenance</span>;
    }
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.truckId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentDriver({
        status: DriverStatus.AVAILABLE,
        avatar: 'https://picsum.photos/60/60',
        hos: { status: 'OFF', driveTimeRemaining: 660, onDutyRemaining: 840, cycleRemaining: 4200 },
        vehicle: { fuelLevel: 100, odometer: 0, engineHours: 0, healthStatus: 'Healthy', defects: 0, nextServiceDate: '2024-01-01' },
        currentLocation: 'Home Terminal',
        coordinates: { lat: 41.8781, lng: -87.6298 }
    });
    setShowModal(true);
  };

  const handleEdit = (driver: Driver) => {
    setIsEditing(true);
    setCurrentDriver({...driver});
    setShowModal(true);
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Driver Roster</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search drivers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add Driver
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-48">HOS Clocks</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Vehicle Telemetry</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDrivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={driver.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div>
                      <p className="font-semibold text-slate-900">{driver.name}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone size={10} />
                        {driver.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    {getStatusBadge(driver.status)}
                    <span className="text-[10px] font-mono text-slate-400">
                        Current: <span className="font-bold">{driver.hos.status}</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {/* Drive Time Bar */}
                    <div>
                        <div className="flex justify-between text-[10px] uppercase text-slate-500 font-bold mb-0.5">
                            <span>Drive</span>
                            <span>{formatMinutes(driver.hos.driveTimeRemaining)}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${driver.hos.driveTimeRemaining < 60 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${(driver.hos.driveTimeRemaining / 660) * 100}%` }} // 11hr max
                            ></div>
                        </div>
                    </div>
                    {/* Cycle Bar */}
                    <div>
                        <div className="flex justify-between text-[10px] uppercase text-slate-500 font-bold mb-0.5">
                            <span>Cycle</span>
                            <span>{formatMinutes(driver.hos.cycleRemaining)}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${driver.hos.cycleRemaining < 480 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                style={{ width: `${(driver.hos.cycleRemaining / 4200) * 100}%` }} // 70hr max
                            ></div>
                        </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin size={14} className="text-slate-400" />
                    {driver.currentLocation}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-1.5 text-slate-700 font-mono text-xs bg-slate-100 px-2 py-1 rounded w-fit">
                        <Truck size={12} className="text-slate-500" />
                        {driver.truckId}
                     </div>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                            <Fuel size={12} className={driver.vehicle.fuelLevel < 25 ? "text-red-500" : "text-green-600"} />
                            {driver.vehicle.fuelLevel}%
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            driver.vehicle.healthStatus === 'Healthy' ? 'bg-green-50 text-green-700' : 
                            driver.vehicle.healthStatus === 'Warning' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {driver.vehicle.healthStatus}
                        </div>
                     </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleEdit(driver)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Edit/Add Modal */}
    {showModal && currentDriver && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">{isEditing ? 'Edit Driver' : 'New Driver'}</h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={currentDriver.avatar} className="w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-100" />
                        <button className="text-sm text-blue-600 hover:underline">Change Photo</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
                                defaultValue={currentDriver.name}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
                                defaultValue={currentDriver.phone}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License #</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
                                defaultValue={currentDriver.licenseNumber}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hire Date</label>
                            <input 
                                type="date" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
                                defaultValue={currentDriver.hireDate}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Truck</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" 
                                defaultValue={currentDriver.truckId}
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input 
                                type="checkbox" 
                                id="hazmat"
                                defaultChecked={currentDriver.hazmatEndorsed}
                                className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <label htmlFor="hazmat" className="text-sm text-slate-700 font-medium">Hazmat Endorsed</label>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button 
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Save Driver
                    </button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};
