import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { FileText, Download, Send, CheckCircle, AlertCircle, Clock, DollarSign, Search, Filter } from 'lucide-react';
import { StatCard } from './StatCard';

interface BillingModuleProps {
  invoices: Invoice[];
  onUpdateStatus: (id: string, status: InvoiceStatus) => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({ invoices, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'ALL' | InvoiceStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'ALL' || inv.status === filter;
    const matchesSearch = 
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.loadId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalOutstanding = invoices
    .filter(i => i.status !== InvoiceStatus.PAID && i.status !== InvoiceStatus.DRAFT)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOverdue = invoices
    .filter(i => i.status === InvoiceStatus.OVERDUE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaidMonth = invoices
    .filter(i => i.status === InvoiceStatus.PAID)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Paid</span>;
      case InvoiceStatus.OVERDUE:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle size={12} /> Overdue</span>;
      case InvoiceStatus.SENT:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Send size={12} /> Sent</span>;
      case InvoiceStatus.DRAFT:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><FileText size={12} /> Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Billing & Invoices</h2>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <FileText size={16} />
          Create Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Outstanding Balance" 
          value={`$${totalOutstanding.toLocaleString()}`} 
          icon={<DollarSign size={24} className="text-blue-600" />} 
          colorClass="bg-white"
        />
        <StatCard 
          title="Overdue Amount" 
          value={`$${totalOverdue.toLocaleString()}`} 
          icon={<AlertCircle size={24} className="text-red-600" />} 
          colorClass={totalOverdue > 0 ? "bg-red-50 border-red-100" : "bg-white"}
        />
        <StatCard 
          title="Paid This Month" 
          value={`$${totalPaidMonth.toLocaleString()}`} 
          icon={<CheckCircle size={24} className="text-green-600" />} 
          trend="8% vs last month"
          trendUp={true}
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
             {(['ALL', InvoiceStatus.SENT, InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.DRAFT] as const).map((s) => (
               <button
                 key={s}
                 onClick={() => setFilter(s)}
                 className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                   filter === s 
                     ? 'bg-slate-900 text-white' 
                     : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                 }`}
               >
                 {s === 'ALL' ? 'All Invoices' : s}
               </button>
             ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search invoice or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{inv.id}</div>
                      <div className="text-xs text-slate-400 font-mono">Ref: {inv.loadId}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {inv.customer}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        {inv.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {inv.status !== InvoiceStatus.PAID && (
                           <button 
                             onClick={() => onUpdateStatus(inv.id, InvoiceStatus.PAID)}
                             className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                             title="Mark as Paid"
                           >
                             <CheckCircle size={18} />
                           </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
           <p className="text-xs text-center text-slate-400">Showing {filteredInvoices.length} invoices</p>
        </div>
      </div>
    </div>
  );
};