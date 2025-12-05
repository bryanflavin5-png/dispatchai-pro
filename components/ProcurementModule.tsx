import React, { useState } from 'react';
import { LaneMetric, RFP } from '../types';
import { TrendingUp, TrendingDown, Target, BarChart2, Briefcase, Map, ArrowRight } from 'lucide-react';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ProcurementModuleProps {
  lanes: LaneMetric[];
  rfps: RFP[];
}

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({ lanes, rfps }) => {
  const [activeTab, setActiveTab] = useState<'network' | 'rfp'>('network');

  const wonRfps = rfps.filter(r => r.status === 'Won').length;
  const activeRfps = rfps.filter(r => r.status === 'Active').length;
  const totalVolume = rfps.reduce((acc, r) => acc + r.volume, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Procurement & Planning (TPP)</h2>
           <p className="text-sm text-slate-500">Network balance, lane analysis, and bid management</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button 
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'network' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Network Analysis
            </button>
            <button 
                onClick={() => setActiveTab('rfp')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'rfp' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Bid Management
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Won Contracts" 
          value={wonRfps} 
          icon={<Briefcase size={24} className="text-green-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Active Bids" 
          value={activeRfps} 
          icon={<Target size={24} className="text-blue-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Projected Volume" 
          value={totalVolume.toLocaleString()} 
          icon={<BarChart2 size={24} className="text-purple-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Market Variance" 
          value="+4.2%" 
          icon={<TrendingUp size={24} className="text-amber-600" />} 
          colorClass="bg-white"
          trend="Above Market"
          trendUp={true}
        />
      </div>

      {activeTab === 'network' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-6">Rate Analysis: My Fleet vs Market Index</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={lanes} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickFormatter={(val) => `$${val}`} />
                            <YAxis type="category" dataKey="destination" width={100} tick={{fontSize: 12}} />
                            <Tooltip formatter={(val: number) => `$${val.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="avgMarketRate" name="Market Rate" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="avgMyRate" name="My Rate" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4">Lane Balance</h3>
                <div className="flex-1 overflow-y-auto space-y-4">
                    {lanes.map((lane) => (
                        <div key={lane.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    {lane.origin.split(',')[0]} <ArrowRight size={14} className="text-slate-400" /> {lane.destination.split(',')[0]}
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                    lane.balance === 'Headhaul' ? 'bg-green-100 text-green-700' :
                                    lane.balance === 'Backhaul' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {lane.balance}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Vol: {lane.volume}/mo</span>
                                <span>Accept: {lane.tenderAcceptance}%</span>
                            </div>
                            <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${lane.tenderAcceptance}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'rfp' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">RFP ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Lane/Region</th>
                            <th className="px-6 py-4">Volume</th>
                            <th className="px-6 py-4">Target Rate</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rfps.map((rfp) => (
                            <tr key={rfp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">{rfp.id}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">{rfp.customer}</td>
                                <td className="px-6 py-4">{rfp.lane}</td>
                                <td className="px-6 py-4 font-mono">{rfp.volume.toLocaleString()}</td>
                                <td className="px-6 py-4 font-mono text-green-600 font-medium">${rfp.targetRate.toFixed(2)}</td>
                                <td className="px-6 py-4 text-xs">{rfp.dueDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        rfp.status === 'Won' ? 'bg-green-100 text-green-800' :
                                        rfp.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                        rfp.status === 'Submitted' ? 'bg-amber-100 text-amber-800' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {rfp.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};