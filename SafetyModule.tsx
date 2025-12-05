
import React, { useState } from 'react';
import { Driver, SafetyProfile, SafetyIncident, DailyLog, LogEditRequest, ELDEvent, ELDStatus, UnassignedEvent } from '../types';
import { ShieldCheck, AlertTriangle, Search, Activity, Award, CheckCircle, Video, PlayCircle, Clock, Edit3, XCircle, FileText, UserCheck, AlertOctagon, HelpCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { MOCK_DQ_FILES, MOCK_COACHING, MOCK_CSA_SCORES, MOCK_CLEARINGHOUSE, MOCK_UNASSIGNED } from '../constants';

interface SafetyModuleProps {
  drivers: Driver[];
  profiles: SafetyProfile[];
  incidents: SafetyIncident[];
  logs?: DailyLog[];
  logEdits?: LogEditRequest[];
}

export const SafetyModule: React.FC<SafetyModuleProps> = ({ drivers, profiles, incidents, logs = [], logEdits = [] }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'telematics' | 'dqfiles' | 'coaching' | 'compliance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Log Viewer State
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(drivers[0]?.id || null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<ELDEvent | null>(null);
  const [editReason, setEditReason] = useState('');
  const [editStatus, setEditStatus] = useState<ELDStatus>('OFF');

  // Stats
  const avgSafetyScore = Math.round(profiles.reduce((acc, curr) => acc + curr.safetyScore, 0) / profiles.length);
  const auditReadyDrivers = profiles.filter(p => p.dqFileStatus === 'Audit Ready').length;
  const openIncidents = incidents.filter(i => i.status !== 'Closed').length;
  const harshEvents = profiles.reduce((acc, curr) => acc + curr.telematics.harshBraking + curr.telematics.rapidAccel + curr.telematics.harshCornering, 0);

  const getDriverName = (id: string) => drivers.find(d => d.id === id)?.name || id;
  const getDriverAvatar = (id: string) => drivers.find(d => d.id === id)?.avatar;

  // Filter logs for selected driver
  const driverLogs = logs.filter(l => l.driverId === selectedDriverId);
  const currentLog = selectedLogId ? driverLogs.find(l => l.id === selectedLogId) : driverLogs[0];
  const pendingEdits = logEdits.filter(e => e.logId === currentLog?.id && e.status === 'Pending');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const renderGridRow = (status: ELDStatus, events: ELDEvent[]) => {
    return (
      <div className="flex items-center h-10 border-b border-slate-100 relative">
        <div className="w-16 text-xs font-bold text-slate-500 border-r border-slate-200 h-full flex items-center pr-2 justify-end">
          {status}
        </div>
        <div className="flex-1 h-full relative bg-slate-50/30">
           {/* Hour Markers */}
           {Array.from({ length: 24 }).map((_, i) => (
             <div key={i} className="absolute top-0 bottom-0 border-l border-slate-200" style={{ left: `${(i/24)*100}%` }}></div>
           ))}
           
           {/* Event Bars */}
           {events.filter(e => e.status === status).map(e => {
             const [h, m] = e.startTime.split(':').map(Number);
             const startPercent = ((h * 60 + m) / 1440) * 100;
             const durationPercent = (e.duration || 60) / 1440 * 100; // Mock duration if missing
             
             return (
               <div 
                 key={e.id}
                 className="absolute h-4 top-3 bg-blue-600 rounded-sm hover:bg-blue-700 cursor-pointer"
                 style={{ left: `${startPercent}%`, width: `${Math.max(durationPercent, 0.5)}%` }}
                 title={`${e.startTime} - ${e.location}`}
                 onClick={() => setEditingEvent(e)}
               ></div>
             );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Safety & Compliance Command Center</h2>
           <p className="text-sm text-slate-500">FMCSA Compliance, CSA Scores, and Telematics</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('compliance')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'compliance' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                FMCSA / CSA
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'logs' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                HOS / Logs
            </button>
            <button 
                onClick={() => setActiveTab('telematics')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'telematics' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Telematics
            </button>
            <button 
                onClick={() => setActiveTab('dqfiles')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'dqfiles' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                DQ Files
            </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
            title="CSA Score (HOS)" 
            value={MOCK_CSA_SCORES.find(c => c.category === 'HOS Compliance')?.score + '%'} 
            icon={<ShieldCheck size={24} className="text-amber-600" />} 
            colorClass="bg-white"
            trend="Needs Attention"
            trendUp={false}
            />
            <StatCard 
            title="Audit Ready Files" 
            value={`${auditReadyDrivers}/${drivers.length}`} 
            icon={<UserCheck size={24} className="text-green-600" />} 
            colorClass="bg-white"
            />
            <StatCard 
            title="Unassigned Miles" 
            value={MOCK_UNASSIGNED.filter(u => u.status === 'Pending').length} 
            icon={<AlertOctagon size={24} className="text-red-600" />} 
            colorClass={MOCK_UNASSIGNED.length > 0 ? "bg-red-50" : "bg-white"}
            />
            <StatCard 
            title="Open Incidents" 
            value={openIncidents} 
            icon={<AlertTriangle size={24} className="text-red-600" />} 
            colorClass={openIncidents > 0 ? "bg-red-50 border-red-100" : "bg-white"}
            />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[500px]">
        
        {/* Toolbar (Search) */}
        {activeTab !== 'logs' && activeTab !== 'compliance' && (
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">
                    {activeTab === 'overview' ? 'Top Safety Performers' : activeTab === 'telematics' ? 'Driver Telematics Scorecard' : activeTab === 'dqfiles' ? 'Driver Qualification (DQ) Files' : 'Remedial Coaching'}
                </h3>
                <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                    type="text" 
                    placeholder="Search drivers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        )}

        {/* FMCSA / CSA Compliance Tab */}
        {activeTab === 'compliance' && (
            <div className="p-6 space-y-8">
                {/* CSA Scorecard */}
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" size={20}/>
                        CSA BASIC Scores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MOCK_CSA_SCORES.map((score) => (
                            <div key={score.category} className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-semibold text-slate-700">{score.category}</span>
                                    {score.status === 'Warning' ? (
                                        <AlertTriangle size={16} className="text-amber-500" />
                                    ) : score.status === 'Alert' ? (
                                        <AlertOctagon size={16} className="text-red-500" />
                                    ) : (
                                        <CheckCircle size={16} className="text-green-500" />
                                    )}
                                </div>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-2xl font-bold text-slate-900">{score.score}%</span>
                                    <span className="text-xs text-slate-500 mb-1">Threshold: {score.threshold}%</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${score.score > score.threshold ? 'bg-red-500' : score.score > score.threshold * 0.8 ? 'bg-amber-500' : 'bg-green-500'}`} 
                                        style={{ width: `${Math.min(score.score, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    Trend: {score.trend === 'Improving' ? <span className="text-green-600">Improving</span> : <span className="text-red-600">Worsening</span>}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Unassigned Driving Manager */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <AlertOctagon className="text-red-600" size={20}/>
                            Unassigned Driving Events
                            <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                {MOCK_UNASSIGNED.filter(u => u.status === 'Pending').length} Pending
                            </span>
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Vehicle</th>
                                        <th className="px-4 py-3">Time / Location</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {MOCK_UNASSIGNED.map(event => (
                                        <tr key={event.id}>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-slate-800">{event.vehicleId}</div>
                                                <div className="text-xs text-slate-500">{event.miles} miles</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs font-mono">{event.startTime}</div>
                                                <div className="text-xs text-slate-500 truncate max-w-[150px]">{event.location}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {event.status === 'Pending' ? (
                                                    <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                                                        Assign
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Resolved</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Drug & Alcohol Clearinghouse */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <UserCheck className="text-purple-600" size={20}/>
                            D&A Clearinghouse Status
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Driver</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Next Due</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {MOCK_CLEARINGHOUSE.map(query => {
                                        const driver = drivers.find(d => d.id === query.driverId);
                                        return (
                                            <tr key={query.driverId}>
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <img src={driver?.avatar} className="w-6 h-6 rounded-full" />
                                                    <span className="font-medium text-slate-900">{driver?.name}</span>
                                                </td>
                                                <td className="px-4 py-3 text-xs">{query.type}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                        query.status === 'Clear' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {query.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono">{query.nextQueryDue}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* HOS / ELD LOGS TAB */}
        {activeTab === 'logs' && (
            <div className="flex h-full min-h-[600px]">
                {/* Sidebar: Driver List */}
                <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Drivers</h4>
                    <div className="space-y-2">
                        {drivers.map(d => (
                            <div 
                                key={d.id}
                                onClick={() => { setSelectedDriverId(d.id); setSelectedLogId(null); }}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedDriverId === d.id ? 'bg-white shadow-sm ring-1 ring-blue-500' : 'hover:bg-slate-200/50'}`}
                            >
                                <img src={d.avatar} className="w-8 h-8 rounded-full" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-slate-900 truncate">{d.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{d.truckId}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content: Log View */}
                <div className="flex-1 flex flex-col">
                    {currentLog ? (
                        <>
                            {/* Log Header */}
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{currentLog.date}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${currentLog.certified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {currentLog.certified ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                            {currentLog.certified ? 'Certified' : 'Uncertified'}
                                        </span>
                                        <span className="text-xs text-slate-500">| Miles: {currentLog.milesDriven}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                                        Previous Day
                                    </button>
                                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                                        Next Day
                                    </button>
                                </div>
                            </div>

                            {/* Pending Edits Alert */}
                            {pendingEdits.length > 0 && (
                                <div className="bg-blue-50 border-b border-blue-100 p-3 flex items-center gap-3">
                                    <Edit3 size={18} className="text-blue-600" />
                                    <span className="text-sm text-blue-800 font-medium">You have {pendingEdits.length} pending edit request(s) waiting for driver approval.</span>
                                </div>
                            )}

                            {/* 24 Hour Grid */}
                            <div className="p-6 border-b border-slate-200 bg-white">
                                <div className="border border-slate-300 rounded-md overflow-hidden">
                                    <div className="flex h-6 bg-slate-100 border-b border-slate-200 text-[10px] text-slate-500 font-bold">
                                        <div className="w-16 border-r border-slate-200 flex items-center justify-center">Status</div>
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <div key={i} className="flex-1 flex items-center justify-center border-l border-slate-200">{i}</div>
                                        ))}
                                    </div>
                                    {renderGridRow('OFF', currentLog.events)}
                                    {renderGridRow('SB', currentLog.events)}
                                    {renderGridRow('D', currentLog.events)}
                                    {renderGridRow('ON', currentLog.events)}
                                </div>
                            </div>

                            {/* Events Table */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">#</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Start</th>
                                            <th className="px-4 py-3">Duration</th>
                                            <th className="px-4 py-3">Location</th>
                                            <th className="px-4 py-3">Notes</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentLog.events.map((evt, idx) => (
                                            <tr key={evt.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-mono text-xs">{idx + 1}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-bold px-2 py-1 rounded text-xs ${
                                                        evt.status === 'ON' ? 'bg-blue-100 text-blue-800' :
                                                        evt.status === 'D' ? 'bg-green-100 text-green-800' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>{evt.status}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono">{evt.startTime}</td>
                                                <td className="px-4 py-3">{Math.floor(evt.duration / 60)}h {evt.duration % 60}m</td>
                                                <td className="px-4 py-3">{evt.location}</td>
                                                <td className="px-4 py-3 text-xs italic text-slate-500">{evt.notes || '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button 
                                                        onClick={() => setEditingEvent(evt)}
                                                        className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Clock size={48} className="mb-4 opacity-20" />
                            <p>Select a driver to view HOS logs</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
             <div className="grid grid-cols-1 lg:grid-cols-2">
                 <div className="border-r border-slate-100">
                     <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Safety Leaderboard
                     </div>
                     <div className="divide-y divide-slate-100">
                        {profiles.sort((a,b) => b.safetyScore - a.safetyScore).map((p, idx) => {
                            const d = drivers.find(drv => drv.id === p.driverId);
                            return (
                                <div key={p.driverId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-slate-300 text-lg w-6">{idx + 1}</div>
                                        <img src={d?.avatar} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-bold text-slate-800">{d?.name}</div>
                                            <div className="text-xs text-slate-500">{d?.truckId}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-lg font-bold ${p.safetyScore > 90 ? 'text-green-600' : 'text-amber-600'}`}>{p.safetyScore}</span>
                                        <span className="text-[10px] text-slate-400">POINTS</span>
                                    </div>
                                </div>
                            )
                        })}
                     </div>
                 </div>
                 <div>
                    <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Recent Incidents
                    </div>
                    <div className="divide-y divide-slate-100">
                        {incidents.map(inc => (
                            <div key={inc.id} className="p-4">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inc.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {inc.severity}
                                    </span>
                                    <span className="text-xs text-slate-400">{inc.date}</span>
                                </div>
                                <div className="font-medium text-slate-800">{inc.type}</div>
                                <div className="text-sm text-slate-600 mb-2">{inc.description}</div>
                                <div className="flex items-center gap-2">
                                    <img src={getDriverAvatar(inc.driverId)} className="w-6 h-6 rounded-full" />
                                    <span className="text-xs font-medium text-slate-700">{getDriverName(inc.driverId)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
        )}

        {/* Telematics Tab */}
        {activeTab === 'telematics' && (
             <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-4">Driver</th>
                   <th className="px-6 py-4">Overall Score</th>
                   <th className="px-6 py-4 text-center">Harsh Braking</th>
                   <th className="px-6 py-4 text-center">Rapid Accel</th>
                   <th className="px-6 py-4 text-center">Cornering</th>
                   <th className="px-6 py-4 text-center">Speeding</th>
                   <th className="px-6 py-4 text-right">Trend</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {profiles
                    .filter(p => getDriverName(p.driverId).toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((profile) => {
                     const driver = drivers.find(d => d.id === profile.driverId);
                     return (
                        <tr key={profile.driverId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={driver?.avatar} alt="" className="w-9 h-9 rounded-full bg-slate-200" />
                                    <div>
                                        <div className="font-semibold text-slate-900">{driver?.name}</div>
                                        <div className="text-xs text-slate-400">{driver?.truckId}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-xs border ${getScoreColor(profile.safetyScore)}`}>
                                    {profile.safetyScore} / 100
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`font-mono ${profile.telematics.harshBraking > 0 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                                    {profile.telematics.harshBraking}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`font-mono ${profile.telematics.rapidAccel > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                    {profile.telematics.rapidAccel}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`font-mono ${profile.telematics.harshCornering > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                    {profile.telematics.harshCornering}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className={`font-mono ${profile.telematics.speedingEvents > 0 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                                    {profile.telematics.speedingEvents}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Activity size={16} className="text-slate-400 ml-auto" />
                            </td>
                        </tr>
                     );
                 })}
               </tbody>
             </table>
           </div>
        )}

        {/* DQ Files Tab */}
        {activeTab === 'dqfiles' && (
             <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-4">Driver</th>
                   <th className="px-6 py-4">File Status</th>
                   <th className="px-6 py-4">Application</th>
                   <th className="px-6 py-4">MVR</th>
                   <th className="px-6 py-4">CDL</th>
                   <th className="px-6 py-4">Medical Card</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {MOCK_DQ_FILES.map((dq) => {
                     const driver = drivers.find(d => d.id === dq.driverId);
                     const isCritical = dq.mvr === 'Expired' || dq.cdl === 'Expired' || dq.medicalCard === 'Expired';
                     return (
                        <tr key={dq.driverId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{driver?.name}</td>
                            <td className="px-6 py-4">
                                {isCritical ? (
                                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">
                                        <AlertTriangle size={12} /> CRITICAL
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
                                        <CheckCircle size={12} /> Audit Ready
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1 text-xs">
                                    {dq.application === 'Verified' ? <CheckCircle size={12} className="text-green-500"/> : <AlertTriangle size={12} className="text-red-500"/>}
                                    {dq.application}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-xs ${dq.mvr === 'Current' ? 'text-slate-600' : 'text-red-600 font-bold'}`}>{dq.mvr}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-xs ${dq.cdl === 'Current' ? 'text-slate-600' : 'text-red-600 font-bold'}`}>{dq.cdl}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-xs ${dq.medicalCard === 'Current' ? 'text-slate-600' : dq.medicalCard === 'Expiring' ? 'text-amber-600 font-bold' : 'text-red-600 font-bold'}`}>{dq.medicalCard}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Manage Files</button>
                            </td>
                        </tr>
                     );
                 })}
               </tbody>
             </table>
           </div>
        )}

        {/* Coaching Tab */}
        {activeTab === 'coaching' && (
             <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-4">Session ID</th>
                   <th className="px-6 py-4">Driver</th>
                   <th className="px-6 py-4">Topic</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Due Date</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {MOCK_COACHING.map((coach) => {
                     const driver = drivers.find(d => d.id === coach.driverId);
                     return (
                        <tr key={coach.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">{coach.id}</td>
                            <td className="px-6 py-4 flex items-center gap-2">
                                <img src={driver?.avatar} className="w-6 h-6 rounded-full" />
                                <span className="font-medium text-slate-900">{driver?.name}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Video size={14} className="text-slate-400" />
                                    {coach.topic}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    coach.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {coach.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs">{coach.dueDate}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center justify-end gap-1">
                                    <PlayCircle size={14} /> Review
                                </button>
                            </td>
                        </tr>
                     );
                 })}
               </tbody>
             </table>
           </div>
        )}
      </div>

      {/* Edit Log Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Propose Edit to Log</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
                <span className="font-bold block mb-1">Compliance Warning</span>
                Per FMCSA regulations, all edits must be annotated. The driver will be notified and must accept these changes before they are applied to the legal record.
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  {(['OFF', 'SB', 'D', 'ON'] as ELDStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => setEditStatus(status)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                        (editStatus || editingEvent.status) === status 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      defaultValue={editingEvent.startTime}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      defaultValue={editingEvent.location}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Edit (Required)</label>
                <textarea 
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="e.g. Driver forgot to log off duty..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm h-24 resize-none"
                ></textarea>
              </div>

              <button 
                onClick={() => {
                   // In a real app, this would submit the LogEditRequest
                   setEditingEvent(null);
                   setEditReason('');
                }}
                disabled={!editReason}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
