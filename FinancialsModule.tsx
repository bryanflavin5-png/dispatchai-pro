
import React, { useState } from 'react';
import { Invoice, InvoiceStatus, Expense, Settlement } from '../types';
import { FileText, Download, CheckCircle, AlertCircle, Clock, DollarSign, Search, Plus, TrendingDown, TrendingUp, PieChart, Landmark, Map } from 'lucide-react';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { MOCK_IFTA } from '../constants';

interface FinancialsModuleProps {
  invoices: Invoice[];
  expenses: Expense[];
  settlements: Settlement[];
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
}

export const FinancialsModule: React.FC<FinancialsModuleProps> = ({ invoices, expenses, settlements, onUpdateInvoiceStatus }) => {
  const [activeTab, setActiveTab] = useState<'AR' | 'AP' | 'Settlements' | 'PL' | 'IFTA'>('AR');
  const [filter, setFilter] = useState<string>('ALL');

  // --- Calculations ---

  // AR Stats
  const totalReceivables = invoices
    .filter(i => i.status !== InvoiceStatus.PAID && i.status !== InvoiceStatus.DRAFT)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOverdue = invoices
    .filter(i => i.status === InvoiceStatus.OVERDUE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // AP Stats
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const fuelExpenses = expenses.filter(e => e.category === 'Fuel').reduce((acc, curr) => acc + curr.amount, 0);

  // P&L
  const totalRevenue = invoices.filter(i => i.status === InvoiceStatus.PAID || i.status === InvoiceStatus.SENT).reduce((acc, curr) => acc + curr.amount, 0);
  const totalSettlements = settlements.reduce((acc, curr) => acc + curr.netPay, 0);
  const netProfit = totalRevenue - totalExpenses - totalSettlements;

  // IFTA Stats
  const totalIFTATaxDue = MOCK_IFTA.reduce((acc, curr) => acc + curr.taxDue, 0);
  const totalIFTAGallons = MOCK_IFTA.reduce((acc, curr) => acc + curr.fuelPurchased, 0);

  // Aging Data for Chart
  const agingData = [
    { name: 'Current', amount: invoices.filter(i => i.agingDays <= 30 && i.status !== 'Paid').reduce((acc, c) => acc + c.amount, 0) },
    { name: '30-60 Days', amount: invoices.filter(i => i.agingDays > 30 && i.agingDays <= 60).reduce((acc, c) => acc + c.amount, 0) },
    { name: '60-90 Days', amount: invoices.filter(i => i.agingDays > 60 && i.agingDays <= 90).reduce((acc, c) => acc + c.amount, 0) },
    { name: '90+ Days', amount: invoices.filter(i => i.agingDays > 90).reduce((acc, c) => acc + c.amount, 0) },
  ];

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Paid</span>;
      case InvoiceStatus.OVERDUE:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12} /> Overdue</span>;
      case InvoiceStatus.SENT:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock size={12} /> Sent</span>;
      case InvoiceStatus.FACTORING_SUBMITTED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Landmark size={12} /> Factoring: Submitted</span>;
      case InvoiceStatus.FACTORING_FUNDED:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><DollarSign size={12} /> Factoring: Funded</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><FileText size={12} /> Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Financial Control Center</h2>
           <p className="text-sm text-slate-500">Accounting, Settlements, and Profitability</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('AR')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'AR' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Accounts Receivable
            </button>
            <button 
                onClick={() => setActiveTab('AP')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'AP' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Accounts Payable
            </button>
            <button 
                onClick={() => setActiveTab('Settlements')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'Settlements' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Driver Settlements
            </button>
            <button 
                onClick={() => setActiveTab('PL')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'PL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Profit & Loss
            </button>
            <button 
                onClick={() => setActiveTab('IFTA')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'IFTA' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                IFTA Tax
            </button>
        </div>
      </div>

      {/* --- AR Tab (Invoices) --- */}
      {activeTab === 'AR' && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                title="Total Outstanding" 
                value={`$${totalReceivables.toLocaleString()}`} 
                icon={<DollarSign size={24} className="text-blue-600" />} 
                colorClass="bg-white"
                />
                <StatCard 
                title="Overdue Invoices" 
                value={`$${totalOverdue.toLocaleString()}`} 
                icon={<AlertCircle size={24} className="text-red-600" />} 
                colorClass={totalOverdue > 0 ? "bg-red-50 border-red-100" : "bg-white"}
                />
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Aging Report</h4>
                    <div className="h-20">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={agingData}>
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Invoices & Factoring</h3>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Plus size={16} /> New Invoice
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Invoice #</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Aging</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono font-medium">{inv.id}</td>
                            <td className="px-6 py-4">{inv.customer}</td>
                            <td className="px-6 py-4 text-right font-mono text-slate-900">${inv.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                            <td className="px-6 py-4">
                                {inv.status !== InvoiceStatus.PAID && inv.status !== InvoiceStatus.FACTORING_FUNDED ? (
                                    <span className={`text-xs font-bold ${inv.agingDays > 30 ? 'text-red-600' : 'text-slate-500'}`}>
                                        {inv.agingDays} Days
                                    </span>
                                ) : (
                                    <span className="text-xs text-green-600 font-medium">Closed</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">Manage</button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

      {/* --- AP Tab (Expenses) --- */}
      {activeTab === 'AP' && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Total Expenses (Mo)" 
                    value={`$${totalExpenses.toLocaleString()}`} 
                    icon={<TrendingDown size={24} className="text-slate-600" />} 
                    colorClass="bg-white"
                />
                <StatCard 
                    title="Fuel Spend" 
                    value={`$${fuelExpenses.toLocaleString()}`} 
                    icon={<DollarSign size={24} className="text-amber-600" />} 
                    colorClass="bg-white"
                />
                 <StatCard 
                    title="Net Cash Flow" 
                    value={`$${(totalRevenue - totalExpenses).toLocaleString()}`} 
                    icon={<PieChart size={24} className="text-blue-600" />} 
                    colorClass="bg-white"
                />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Operational Expenses</h3>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Plus size={16} /> Add Expense
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {expenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-xs font-mono">{exp.date}</td>
                            <td className="px-6 py-4">
                                <span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">{exp.category}</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-800">{exp.vendor}</td>
                            <td className="px-6 py-4">{exp.description}</td>
                            <td className="px-6 py-4 text-xs font-mono">{exp.truckId || '-'}</td>
                            <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">${exp.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

      {/* --- Settlements Tab --- */}
      {activeTab === 'Settlements' && (
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Driver Payroll & Settlements</h3>
                <div className="text-sm text-slate-500">Period: Oct 15 - Oct 21</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4">Driver</th>
                        <th className="px-6 py-4 text-right">Gross Pay</th>
                        <th className="px-6 py-4 text-right">Deductions</th>
                        <th className="px-6 py-4 text-right">Net Pay</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {settlements.map((set) => (
                        <tr key={set.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{set.driverId}</td>
                        <td className="px-6 py-4 text-right font-mono text-slate-600">${set.grossPay.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono text-red-600">-${(set.deductions.fuel + set.deductions.advances + set.deductions.insurance + set.deductions.other).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-green-700">${set.netPay.toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                set.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                set.status === 'Approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                                {set.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">View Sheet</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- P&L Tab --- */}
      {activeTab === 'PL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-6">Profitability Breakdown</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Revenue', value: totalRevenue, fill: '#3b82f6' },
                            { name: 'Expenses', value: totalExpenses, fill: '#f59e0b' },
                            { name: 'Payroll', value: totalSettlements, fill: '#64748b' },
                            { name: 'Net Profit', value: netProfit, fill: netProfit > 0 ? '#22c55e' : '#ef4444' }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tickFormatter={(v) => `$${v/1000}k`} />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Gross Revenue</span>
                            <span className="font-mono font-medium">${totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Fixed Expenses (Ins/Office)</span>
                            <span className="font-mono font-medium text-slate-600">-${(totalExpenses * 0.4).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Variable Expenses (Fuel/Maint)</span>
                            <span className="font-mono font-medium text-slate-600">-${(totalExpenses * 0.6).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Driver Payroll</span>
                            <span className="font-mono font-medium text-slate-600">-${totalSettlements.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                            <span className="font-bold text-slate-800">Net Profit</span>
                            <span className={`font-mono font-bold ${netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${netProfit.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- IFTA Tab --- */}
      {activeTab === 'IFTA' && (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard 
                    title="Est. Tax Liability" 
                    value={`$${totalIFTATaxDue.toFixed(2)}`} 
                    icon={<Map size={24} className="text-purple-600" />} 
                    colorClass="bg-white"
                />
                <StatCard 
                    title="Total Gallons Purchased" 
                    value={totalIFTAGallons.toLocaleString()} 
                    icon={<DollarSign size={24} className="text-amber-600" />} 
                    colorClass="bg-white"
                />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">IFTA Fuel Tax Report (Q3 2023)</h3>
                    <button className="text-blue-600 text-sm font-medium flex items-center gap-2">
                        <Download size={16} /> Export
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Jurisdiction</th>
                            <th className="px-6 py-4">Total Miles</th>
                            <th className="px-6 py-4">Taxable Miles</th>
                            <th className="px-6 py-4">Tax Paid Gals</th>
                            <th className="px-6 py-4">Net Tax Due</th>
                            <th className="px-6 py-4">MPG</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {MOCK_IFTA.map((entry) => (
                            <tr key={entry.jurisdiction} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{entry.jurisdiction}</td>
                            <td className="px-6 py-4 font-mono">{entry.totalMiles.toLocaleString()}</td>
                            <td className="px-6 py-4 font-mono">{entry.taxableMiles.toLocaleString()}</td>
                            <td className="px-6 py-4 font-mono">{entry.fuelPurchased}</td>
                            <td className="px-6 py-4">
                                <span className={`font-mono font-medium ${entry.taxDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {entry.taxDue > 0 ? `$${entry.taxDue.toFixed(2)}` : `($${Math.abs(entry.taxDue).toFixed(2)})`}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono">{entry.mpg.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
};
