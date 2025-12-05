import React, { useState } from 'react';
import { Driver, WorkOrder, Part } from '../types';
import { Wrench, AlertCircle, CheckCircle, Search, Activity, Package, ClipboardList, PenTool, Tag } from 'lucide-react';
import { StatCard } from './StatCard';

interface MaintenanceModuleProps {
  drivers: Driver[];
  records: WorkOrder[];
  parts: Part[];
}

export const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ drivers, records, parts }) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'workOrders' | 'inventory'>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');

  const vehicles = drivers.map(d => ({
    ...d.vehicle,
    driverName: d.name,
    truckId: d.truckId
  }));

  const healthyCount = vehicles.filter(v => v.healthStatus === 'Healthy').length;
  const criticalCount = vehicles.filter(v => v.healthStatus === 'Critical').length;
  const warrantyClaims = records.filter(r => r.warrantyClaim).length;
  const lowStockItems = parts.filter(p => p.quantity <= p.minQuantity).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Fleet Maintenance (TMT)</h2>
           <p className="text-sm text-slate-500">Asset health, work orders, and parts inventory</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button 
                onClick={() => setActiveTab('vehicles')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'vehicles' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Health
            </button>
            <button 
                onClick={() => setActiveTab('workOrders')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'workOrders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Work Orders
            </button>
            <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Parts
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Critical Vehicles" 
          value={criticalCount} 
          icon={<AlertCircle size={24} className="text-red-600" />} 
          colorClass={criticalCount > 0 ? "bg-red-50 border-red-100" : "bg-white"}
        />
        <StatCard 
          title="Open Work Orders" 
          value={records.filter(r => r.status !== 'Completed').length} 
          icon={<ClipboardList size={24} className="text-blue-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Warranty Claims" 
          value={warrantyClaims} 
          icon={<Tag size={24} className="text-purple-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockItems} 
          icon={<Package size={24} className="text-amber-600" />} 
          colorClass={lowStockItems > 0 ? "bg-amber-50" : "bg-white"}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">
                {activeTab === 'vehicles' ? 'Telematics Dashboard' : activeTab === 'workOrders' ? 'Shop Work Orders' : 'Parts Inventory'}
            </h3>
            <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        {/* Vehicles View */}
        {activeTab === 'vehicles' && (
             <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-4">Vehicle</th>
                   <th className="px-6 py-4">Health</th>
                   <th className="px-6 py-4">Fuel</th>
                   <th className="px-6 py-4">Odometer</th>
                   <th className="px-6 py-4">Next Service</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {vehicles
                    .filter(v => v.truckId.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((vehicle) => (
                        <tr key={vehicle.truckId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{vehicle.truckId}</div>
                                <div className="text-xs text-slate-400">Op: {vehicle.driverName}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    vehicle.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800 border-green-200' : 
                                    vehicle.healthStatus === 'Warning' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                    'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        vehicle.healthStatus === 'Healthy' ? 'bg-green-600' : 
                                        vehicle.healthStatus === 'Warning' ? 'bg-amber-600' : 'bg-red-600'
                                    }`}></div>
                                    {vehicle.healthStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${vehicle.fuelLevel < 20 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                      style={{ width: `${vehicle.fuelLevel}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-mono mt-1 block">{vehicle.fuelLevel}%</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">
                                {vehicle.odometer.toLocaleString()} mi
                            </td>
                            <td className="px-6 py-4 text-xs font-medium">
                                {vehicle.nextServiceDate}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                                    Diagnostics
                                </button>
                            </td>
                        </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {/* Work Orders View (TMT) */}
        {activeTab === 'workOrders' && (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                    <th className="px-6 py-4">WO #</th>
                    <th className="px-6 py-4">Truck</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Mechanic</th>
                    <th className="px-6 py-4 text-right">Total Cost</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-mono text-xs font-bold">{record.id}</div>
                                {record.warrantyClaim && (
                                    <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded border border-purple-200">Warranty</span>
                                )}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-800">{record.truckId}</td>
                            <td className="px-6 py-4">
                                <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200 font-medium">
                                    {record.type}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    record.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                    record.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1">
                                    <PenTool size={12} className="text-slate-400" />
                                    {record.mechanic || 'Unassigned'}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-slate-900">
                                ${record.totalCost.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )}

        {/* Inventory View (TMT) */}
        {activeTab === 'inventory' && (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                    <th className="px-6 py-4">Part Name</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Stock Level</th>
                    <th className="px-6 py-4 text-right">Unit Cost</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {parts.map((part) => (
                        <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-800">{part.name}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{part.sku}</td>
                            <td className="px-6 py-4">
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{part.category}</span>
                            </td>
                            <td className="px-6 py-4 text-xs">{part.location}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold ${part.quantity <= part.minQuantity ? 'text-red-600' : 'text-slate-700'}`}>
                                        {part.quantity}
                                    </span>
                                    {part.quantity <= part.minQuantity && (
                                        <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Low Stock</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-slate-600">
                                ${part.unitCost.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};