
import React, { useState } from 'react';
import { Truck, Trailer } from '../types';
import { Search, Plus, Edit2, Trash2, XCircle, Truck as TruckIcon, Box } from 'lucide-react';
import { StatCard } from './StatCard';

interface AssetsModuleProps {
  trucks: Truck[];
  trailers: Trailer[];
}

export const AssetsModule: React.FC<AssetsModuleProps> = ({ trucks, trailers }) => {
  const [activeTab, setActiveTab] = useState<'trucks' | 'trailers'>('trucks');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<any>(null); // Quick type for modal
  
  const activeTrucks = trucks.filter(t => t.status === 'Active').length;
  const maintenanceTrucks = trucks.filter(t => t.status === 'Maintenance').length;
  
  const handleEditTruck = (truck: Truck) => {
    setCurrentAsset(truck);
    setShowModal(true);
  };
  
  const handleEditTrailer = (trailer: Trailer) => {
    setCurrentAsset(trailer);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setCurrentAsset({});
    setShowModal(true);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Fleet Asset Manager</h2>
           <p className="text-sm text-slate-500">Manage Trucks and Trailers</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button 
                onClick={() => setActiveTab('trucks')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'trucks' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <TruckIcon size={14} /> Trucks
            </button>
            <button 
                onClick={() => setActiveTab('trailers')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'trailers' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <Box size={14} /> Trailers
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Power Units" 
          value={trucks.length} 
          icon={<TruckIcon size={24} className="text-blue-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Active Trucks" 
          value={activeTrucks} 
          icon={<TruckIcon size={24} className="text-green-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Maintenance" 
          value={maintenanceTrucks} 
          icon={<TruckIcon size={24} className="text-amber-600" />} 
          colorClass={maintenanceTrucks > 0 ? "bg-amber-50" : "bg-white"}
        />
        <StatCard 
          title="Trailers" 
          value={trailers.length} 
          icon={<Box size={24} className="text-slate-600" />} 
          colorClass="bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button 
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                <Plus size={16} /> Add {activeTab === 'trucks' ? 'Truck' : 'Trailer'}
            </button>
          </div>

          <div className="flex-1 overflow-auto">
             {activeTab === 'trucks' && (
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Truck ID</th>
                            <th className="px-6 py-4">Make / Model / Year</th>
                            <th className="px-6 py-4">VIN / Plate</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Mileage</th>
                            <th className="px-6 py-4">Driver</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {trucks
                            .filter(t => t.id.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(truck => (
                            <tr key={truck.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-900">{truck.id}</td>
                                <td className="px-6 py-4">
                                    {truck.year} {truck.make} {truck.model}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-mono text-xs">{truck.vin}</div>
                                    <div className="text-xs text-slate-400">{truck.plate}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        truck.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        truck.status === 'Maintenance' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {truck.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono">{truck.mileage.toLocaleString()} mi</td>
                                <td className="px-6 py-4 text-xs font-medium">
                                    {truck.assignedDriverId || <span className="text-slate-400 italic">Unassigned</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEditTruck(truck)} className="p-1.5 hover:bg-slate-100 rounded text-blue-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}

             {activeTab === 'trailers' && (
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Trailer #</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Contents</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {trailers
                             .filter(t => t.number.toLowerCase().includes(searchTerm.toLowerCase()))
                             .map(trailer => (
                            <tr key={trailer.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-slate-900">{trailer.number}</td>
                                <td className="px-6 py-4">{trailer.type}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        trailer.status === 'Loaded' ? 'bg-green-100 text-green-700' :
                                        trailer.status === 'Empty' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {trailer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {trailer.contents || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEditTrailer(trailer)} className="p-1.5 hover:bg-slate-100 rounded text-blue-600">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}
          </div>
      </div>

      {/* Basic Asset Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">
                        {currentAsset.id || currentAsset.number ? 'Edit' : 'New'} {activeTab === 'trucks' ? 'Truck' : 'Trailer'}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                        <XCircle size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    {activeTab === 'trucks' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Truck ID</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.id} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plate</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.plate} />
                                </div>
                            </div>
                             <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Make</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.make} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Model</label>
                                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.model} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year</label>
                                    <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.year} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">VIN</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.vin} />
                            </div>
                        </>
                    ) : (
                        <>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trailer Number</label>
                                <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.number} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" defaultValue={currentAsset.type}>
                                    <option>Dry Van</option>
                                    <option>Reefer</option>
                                    <option>Flatbed</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium">Cancel</button>
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Save Asset</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
