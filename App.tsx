
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  Map as MapIcon,
  BarChart3,
  CreditCard,
  Globe,
  ShieldCheck,
  Wrench,
  TrendingUp,
  MessageSquare,
  AlertOctagon,
  CheckSquare,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserPlus,
  Warehouse,
  Box
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_DRIVERS, MOCK_LOADS, MOCK_INVOICES, MOCK_SAFETY_PROFILES, MOCK_INCIDENTS, MOCK_WORK_ORDERS, MOCK_PARTS, MOCK_LANE_METRICS, MOCK_RFPS, MOCK_EXPENSES, MOCK_SETTLEMENTS, MOCK_MESSAGES, MOCK_GEOFENCES, MOCK_GEOFENCE_EVENTS, MOCK_DAILY_LOGS, MOCK_LOG_EDITS, MOCK_ALERTS, MOCK_TASKS, MOCK_APPLICANTS, MOCK_YARD_SPOTS, MOCK_TRAILERS, MOCK_TRUCKS } from './constants';
import { Driver, Load, ViewState, DriverStatus, LoadStatus, Invoice, InvoiceStatus, SafetyProfile, SafetyIncident, WorkOrder, Part, LaneMetric, RFP, Expense, Settlement, DriverMessage, Geofence, GeofenceEvent, DailyLog, LogEditRequest, Alert, Task, Applicant, YardSpot, Trailer, Truck as TruckType } from './types';
import { StatCard } from './components/StatCard';
import { LoadBoard } from './components/LoadBoard';
import { DriverList } from './components/DriverList';
import { FinancialsModule } from './components/FinancialsModule';
import { TrackingModule } from './components/TrackingModule';
import { SafetyModule } from './components/SafetyModule';
import { MaintenanceModule } from './components/MaintenanceModule';
import { ProcurementModule } from './components/ProcurementModule';
import { CommunicationsModule } from './components/CommunicationsModule';
import { RecruitmentModule } from './components/RecruitmentModule';
import { YardManagementModule } from './components/YardManagementModule';
import { AssetsModule } from './components/AssetsModule';
import { AIAssistant } from './components/AIAssistant';

// Simple mock data for chart
const CHART_DATA = [
  { name: 'Mon', revenue: 4000, miles: 2400 },
  { name: 'Tue', revenue: 3000, miles: 1398 },
  { name: 'Wed', revenue: 2000, miles: 9800 },
  { name: 'Thu', revenue: 2780, miles: 3908 },
  { name: 'Fri', revenue: 1890, miles: 4800 },
  { name: 'Sat', revenue: 2390, miles: 3800 },
  { name: 'Sun', revenue: 3490, miles: 4300 },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [loads, setLoads] = useState<Load[]>(MOCK_LOADS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [expenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [settlements] = useState<Settlement[]>(MOCK_SETTLEMENTS);
  const [messages] = useState<DriverMessage[]>(MOCK_MESSAGES);
  const [safetyProfiles] = useState<SafetyProfile[]>(MOCK_SAFETY_PROFILES);
  const [incidents] = useState<SafetyIncident[]>(MOCK_INCIDENTS);
  const [workOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [parts] = useState<Part[]>(MOCK_PARTS);
  const [laneMetrics] = useState<LaneMetric[]>(MOCK_LANE_METRICS);
  const [rfps] = useState<RFP[]>(MOCK_RFPS);
  const [geofences] = useState<Geofence[]>(MOCK_GEOFENCES);
  const [geofenceEvents] = useState<GeofenceEvent[]>(MOCK_GEOFENCE_EVENTS);
  const [logs] = useState<DailyLog[]>(MOCK_DAILY_LOGS);
  const [logEdits] = useState<LogEditRequest[]>(MOCK_LOG_EDITS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [applicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [yardSpots] = useState<YardSpot[]>(MOCK_YARD_SPOTS);
  const [trailers] = useState<Trailer[]>(MOCK_TRAILERS);
  const [trucks] = useState<TruckType[]>(MOCK_TRUCKS);

  // Stats calculation
  const totalRevenue = loads.reduce((acc, load) => acc + load.rate, 0);
  const activeLoads = loads.filter(l => l.status === LoadStatus.IN_TRANSIT).length;
  const availableDrivers = drivers.filter(d => d.status === DriverStatus.AVAILABLE).length;

  const assignDriver = (loadId: string, driverId: string) => {
    setLoads(prev => prev.map(l => 
      l.id === loadId ? { ...l, assignedDriverId: driverId, status: LoadStatus.DISPATCHED } : l
    ));
    setDrivers(prev => prev.map(d => 
      d.id === driverId ? { ...d, status: DriverStatus.ON_LOAD } : d
    ));
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    ));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const NavItem = ({ icon: Icon, label, viewName }: { icon: any, label: string, viewName: ViewState }) => (
    <button
      onClick={() => {
        setView(viewName);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
        view === viewName 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static flex-shrink-0`}
      >
        <div className="h-full flex flex-col p-4 overflow-y-auto">
          <div className="flex items-center gap-2 px-2 py-4 mb-6">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Truck className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">DispatchAI</span>
          </div>

          <nav className="space-y-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" viewName="dashboard" />
            <NavItem icon={MapIcon} label="Dispatch Board" viewName="dispatch" />
            <NavItem icon={Globe} label="Live Tracking" viewName="tracking" />
            <NavItem icon={Users} label="Drivers" viewName="drivers" />
            <NavItem icon={MessageSquare} label="Messages" viewName="messages" />
            <div className="pt-2 pb-2">
               <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operations</p>
               <NavItem icon={Box} label="Fleet Assets" viewName="assets" />
               <NavItem icon={ShieldCheck} label="Safety & Logs" viewName="safety" />
               <NavItem icon={Wrench} label="Maintenance" viewName="maintenance" />
               <NavItem icon={Warehouse} label="Yard Management" viewName="yard" />
            </div>
            <div className="pt-2 pb-2">
               <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Business</p>
               <NavItem icon={UserPlus} label="Recruitment" viewName="recruitment" />
               <NavItem icon={TrendingUp} label="Procurement" viewName="procurement" />
               <NavItem icon={CreditCard} label="Financials" viewName="financials" />
               <NavItem icon={BarChart3} label="Analytics" viewName="analytics" />
            </div>
          </nav>

          <div className="pt-4 border-t border-slate-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
              <Settings size={20} />
              Settings
            </button>
            <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl">
              <img src="https://picsum.photos/id/1012/40/40" className="w-8 h-8 rounded-full border border-slate-600" alt="User" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
                <p className="text-xs text-slate-400 truncate">Senior Dispatcher</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 capitalize hidden sm:block">
              {view === 'financials' ? 'Financial Control Center' : view.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 w-64">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search loads, drivers..." 
                className="bg-transparent border-none text-sm focus:outline-none w-full text-slate-600"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
            
            {/* Conditional Views */}
            {view === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                  <StatCard 
                    title="Total Revenue" 
                    value={`$${totalRevenue.toLocaleString()}`} 
                    icon={<DollarSignIcon size={24} className="text-green-600" />} 
                    trend="12% vs last week"
                    trendUp={true}
                  />
                  <StatCard 
                    title="Active Loads" 
                    value={activeLoads} 
                    icon={<PackageIcon size={24} className="text-blue-600" />}
                  />
                  <StatCard 
                    title="Available Drivers" 
                    value={availableDrivers} 
                    icon={<UserIcon size={24} className="text-purple-600" />}
                    colorClass={availableDrivers < 2 ? "bg-amber-50" : "bg-white"}
                  />
                  <StatCard 
                    title="On-Time Delivery" 
                    value="98.5%" 
                    icon={<ClockIcon size={24} className="text-amber-600" />}
                    trend="0.5%"
                    trendUp={true}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Action Center & Tasks (Left Column) */}
                  <div className="lg:col-span-1 space-y-6">
                      {/* Action Center */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                  <AlertOctagon size={16} className="text-amber-500"/>
                                  Action Center
                              </h3>
                              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{alerts.length}</span>
                          </div>
                          <div className="divide-y divide-slate-100">
                              {alerts.length > 0 ? (
                                  alerts.map(alert => (
                                      <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
                                          <div className={`mt-0.5 w-2 h-2 rounded-full ${alert.priority === 'High' ? 'bg-red-500' : alert.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                          <div className="flex-1">
                                              <p className="text-sm font-medium text-slate-800 leading-snug">{alert.message}</p>
                                              <div className="flex justify-between items-center mt-1">
                                                  <span className="text-[10px] text-slate-400">{alert.type} • {alert.timestamp}</span>
                                                  <button onClick={() => removeAlert(alert.id)} className="text-[10px] text-blue-600 hover:underline">Dismiss</button>
                                              </div>
                                          </div>
                                      </div>
                                  ))
                              ) : (
                                  <div className="p-8 text-center text-slate-400 text-sm">All caught up!</div>
                              )}
                          </div>
                      </div>

                      {/* Tasks */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                  <CheckSquare size={16} className="text-blue-500"/>
                                  My Tasks
                              </h3>
                              <button className="text-xs text-blue-600 hover:text-blue-700">+ Add</button>
                          </div>
                          <div className="divide-y divide-slate-100">
                              {tasks.map(task => (
                                  <div key={task.id} className="p-3 flex items-start gap-3 hover:bg-slate-50">
                                      <button onClick={() => toggleTask(task.id)} className={`mt-0.5 flex-shrink-0 w-4 h-4 border rounded flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                          {task.completed && <CheckCircle2 size={12} className="text-white"/>}
                                      </button>
                                      <div className={`flex-1 text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                          {task.text}
                                          {task.dueDate && <div className="text-[10px] text-slate-400 mt-0.5">{task.dueDate}</div>}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Main Charts & Revenue (Right 2 Columns) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Revenue Pacing */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Revenue Performance</h3>
                                <p className="text-sm text-slate-500">Daily Pacing vs Goal</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-900">$18,450</span>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">+12.5%</span>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Actual" />
                                <Bar dataKey="miles" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Active Loads Mini-Board */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">High Priority Loads</h3>
                            <button onClick={() => setView('dispatch')} className="text-xs text-blue-600 flex items-center hover:underline">
                                View All <ChevronRight size={14}/>
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {loads.filter(l => l.status === LoadStatus.IN_TRANSIT).slice(0, 3).map(load => (
                                <div key={load.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {load.id.split('-')[1]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{load.customer}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                {load.origin.split(',')[0]} <ChevronRight size={10}/> {load.destination.split(',')[0]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{load.status}</div>
                                        <div className="text-[10px] text-slate-400 mt-1">Due: {load.deliveryDate}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {view === 'dispatch' && (
              <LoadBoard loads={loads} drivers={drivers} onAssign={assignDriver} />
            )}

            {view === 'drivers' && (
              <DriverList drivers={drivers} />
            )}

            {view === 'assets' && (
              <AssetsModule trucks={trucks} trailers={trailers} />
            )}

            {view === 'financials' && (
              <FinancialsModule 
                invoices={invoices} 
                expenses={expenses} 
                settlements={settlements} 
                onUpdateInvoiceStatus={updateInvoiceStatus} 
              />
            )}
            
            {view === 'tracking' && (
              <TrackingModule 
                drivers={drivers} 
                loads={loads} 
                geofences={geofences}
                geofenceEvents={geofenceEvents}
              />
            )}

            {view === 'safety' && (
              <SafetyModule 
                drivers={drivers} 
                profiles={safetyProfiles} 
                incidents={incidents} 
                logs={logs}
                logEdits={logEdits}
              />
            )}

            {view === 'maintenance' && (
              <MaintenanceModule drivers={drivers} records={workOrders} parts={parts} />
            )}

            {view === 'procurement' && (
              <ProcurementModule lanes={laneMetrics} rfps={rfps} />
            )}

            {view === 'messages' && (
              <CommunicationsModule drivers={drivers} messages={messages} />
            )}

            {view === 'recruitment' && (
              <RecruitmentModule applicants={applicants} />
            )}

            {view === 'yard' && (
              <YardManagementModule spots={yardSpots} trailers={trailers} />
            )}

            {view === 'analytics' && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
                <BarChart3 size={48} className="mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold">Analytics Module</h3>
                <p>Advanced reporting features coming soon.</p>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* AI Assistant Overlay */}
      <AIAssistant drivers={drivers} loads={loads} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Icons wrapper for StatCard to avoid messy imports in App
const DollarSignIcon = (props: any) => <span className={props.className}>$</span>;
const PackageIcon = (props: any) => <Truck {...props} />;
const UserIcon = (props: any) => <Users {...props} />;
const ClockIcon = (props: any) => <span className={props.className}>⏱</span>;

export default App;
