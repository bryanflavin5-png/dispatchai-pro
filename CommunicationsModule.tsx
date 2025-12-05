import React, { useState } from 'react';
import { Driver, DriverMessage } from '../types';
import { MessageSquare, Send, Search, Phone, User, Mic } from 'lucide-react';
import { getAIAdvice } from '../services/geminiService';

interface CommunicationsModuleProps {
  drivers: Driver[];
  messages: DriverMessage[];
}

export const CommunicationsModule: React.FC<CommunicationsModuleProps> = ({ drivers, messages }) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(drivers[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId);
  const driverMessages = messages.filter(m => m.driverId === selectedDriverId);

  const handleAIDraft = async () => {
    setIsDrafting(true);
    const draft = await getAIAdvice(
      "Draft a professional message to the driver asking for an ETA update and reminding them to submit the BOL.",
      { drivers: [selectedDriver!], loads: [] }
    );
    setInputText(draft);
    setIsDrafting(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {drivers.map(driver => (
            <div 
              key={driver.id}
              onClick={() => setSelectedDriverId(driver.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedDriverId === driver.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                    <img src={driver.avatar} className="w-10 h-10 rounded-full bg-slate-200" alt="" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-sm text-slate-900 truncate">{driver.name}</h4>
                        <span className="text-[10px] text-slate-400">10:30 AM</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                        {messages.find(m => m.driverId === driver.id)?.message || 'No messages yet'}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedDriver ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                 <img src={selectedDriver.avatar} className="w-8 h-8 rounded-full" />
                 <div>
                    <h3 className="font-bold text-slate-800">{selectedDriver.name}</h3>
                    <p className="text-xs text-slate-500">{selectedDriver.truckId} • {selectedDriver.currentLocation}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 text-slate-500 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <Phone size={18} />
                 </button>
                 <button className="p-2 text-slate-500 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                    <User size={18} />
                 </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
               {driverMessages.length > 0 ? (
                 driverMessages.map(msg => (
                   <div key={msg.id} className={`flex ${msg.direction === 'Outbound' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl p-3 text-sm ${
                        msg.direction === 'Outbound' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}>
                         <p>{msg.message}</p>
                         <p className={`text-[10px] mt-1 text-right ${msg.direction === 'Outbound' ? 'text-blue-100' : 'text-slate-400'}`}>
                           {msg.timestamp}
                         </p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <MessageSquare size={48} className="mb-2 opacity-20" />
                    <p>No messages yet</p>
                 </div>
               )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
               <div className="flex flex-col gap-2">
                 <div className="flex gap-2">
                    <button 
                      onClick={handleAIDraft}
                      disabled={isDrafting}
                      className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {isDrafting ? 'Drafting...' : <><Mic size={12}/> AI Draft</>}
                    </button>
                 </div>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors">
                      <Send size={18} />
                    </button>
                 </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a driver to start messaging
          </div>
        )}
      </div>
    </div>
  );
};