import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const BloodDashboard = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const donorId = localStorage.getItem('userId');

  useEffect(() => {
    if (donorId) {
      fetchDonorAndRequests(donorId);
    } else {
      setError('Session expired. Please login again.');
    }
  }, [donorId]);

  const fetchDonorAndRequests = async (id: string) => {
    try {
      const [donorRes, requestsRes] = await Promise.all([
        axios.get(`${API_BASE}/donors/${id}`),
        axios.get(`${API_BASE}/requests`)
      ]);
      setBloodGroup(donorRes.data?.bloodGroup || '');
      setGender(donorRes.data?.gender || '');
      setDonorPhone(donorRes.data?.phone || '');
      if (!donorRes.data?.bloodGroup) setShowUpdateForm(true);
      setRequests(requestsRes.data || []);
    } catch (err) {
      setError('Unable to sync with the blood network.');
    }
  };

  const handleAccept = (requestId: string) => {
    if (!donorId) return;
    axios.post(`${API_BASE}/donors/${donorId}/accept`, { requestId })
      .then(() => {
        alert('Thank you! You have accepted this request.');
        fetchRequests();
      })
      .catch(() => setError('Failed to process. Check your connection.'));
  };

  const fetchRequests = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.get(`${API_BASE}/requests`);
      setRequests(res.data || []);
    } finally {
      setIsRefreshing(false);
    }
  };

  const matchingRequests = requests.filter(r => 
    r.bloodGroup === bloodGroup && (r.phone || '').toString() !== donorPhone
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-900 pb-20 mt-20">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        
        {/* Simple Integrated Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Matches <span className="text-red-600">.</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Available emergencies in your area</p>
          </div>
          
          {bloodGroup && (
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Your Type</p>
              <span className="text-2xl font-black text-red-600 leading-none">{bloodGroup}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            {error}
          </div>
        )}

        {/* Profile Completion - Minimalist Card */}
        {showUpdateForm && (
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold mb-1">One last step</h2>
            <p className="text-slate-400 text-sm mb-6">Select your details to see matching requests.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold transition-all">
                <option value="">Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={gender} onChange={e => setGender(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold transition-all">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <button onClick={() => setShowUpdateForm(false)} className="sm:col-span-2 bg-slate-900 text-white p-4 rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-slate-100">
                Start Saving Lives
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Live Requests</h3>
            <button 
              onClick={fetchRequests} 
              className={`text-xs font-black text-slate-400 hover:text-red-600 flex items-center gap-2 transition-colors ${isRefreshing ? 'animate-pulse' : ''}`}
            >
              {isRefreshing ? 'SYNCING...' : 'REFRESH'}
            </button>
        </div>

        {/* The Feed */}
        <div className="space-y-6">
          {matchingRequests.map((r) => (
            <div key={r._id} className="group bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:border-transparent">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-red-600 transition-colors">{r.patientName}</h3>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{r.reason}</p>
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-red-600 font-black text-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  {r.bloodGroup}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase">Hospital</p>
                  <p className="text-sm font-bold text-slate-600">{r.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-300 uppercase">Schedule</p>
                  <p className="text-sm font-bold text-slate-600">
                    {new Date(r.donationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {r.donationTime}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => handleAccept(r._id)}
                className="w-full bg-slate-50 group-hover:bg-red-600 text-slate-400 group-hover:text-white py-4 rounded-3xl font-black transition-all transform active:scale-[0.98] shadow-sm group-hover:shadow-red-200"
              >
                Accept This Request
              </button>
            </div>
          ))}

          {matchingRequests.length === 0 && (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No Matches Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};