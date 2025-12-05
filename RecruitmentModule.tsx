
import React, { useState } from 'react';
import { Applicant } from '../types';
import { UserPlus, Calendar, FileText, CheckCircle, Clock, XCircle, MoreHorizontal } from 'lucide-react';

interface RecruitmentModuleProps {
  applicants: Applicant[];
}

export const RecruitmentModule: React.FC<RecruitmentModuleProps> = ({ applicants }) => {
  const stages = ['New', 'Screening', 'Interview', 'Offer', 'Hired'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Driver Recruitment (ATS)</h2>
           <p className="text-sm text-slate-500">Manage hiring pipeline and applications</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <UserPlus size={16} /> Add Applicant
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full min-w-[1000px] pb-4">
            {stages.map(stage => (
                <div key={stage} className="flex-1 min-w-[250px] bg-slate-100 rounded-xl p-3 flex flex-col">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <h3 className="font-bold text-slate-700 text-sm">{stage}</h3>
                        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                            {applicants.filter(a => a.stage === stage).length}
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {applicants.filter(a => a.stage === stage).map(applicant => (
                            <div key={applicant.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-move">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <img src={applicant.avatar} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{applicant.name}</div>
                                            <div className="text-[10px] text-slate-500">{applicant.licenseType} • {applicant.experienceYears}y Exp</div>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                <div className="text-xs text-slate-500 mb-3 line-clamp-2 bg-slate-50 p-2 rounded">
                                    {applicant.notes}
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} /> {applicant.applicationDate}
                                    </div>
                                    {stage === 'New' && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
