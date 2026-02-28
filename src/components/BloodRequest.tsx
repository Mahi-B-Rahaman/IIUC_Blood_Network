import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE;

export const BloodRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    location: '',
    reason: '',
    bloodGroup: '',
    donationDate: new Date().toISOString().split('T')[0],
    donationTime: ''
  });

  const [status, setStatus] = useState({ message: '', isError: false });
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axios.get(`${API_BASE}/donors/${userId}`)
      .then(res => {
        const phone = res.data?.phone;
        if (phone) {
          setFormData(prev => ({ ...prev, phone }));
          return axios.get(`${API_BASE}/requests`)
            .then(reqRes => {
              const requests = reqRes.data || [];
              const existing = requests.find((r: any) => (r.phone || '').toString() === phone.toString());
              if (existing) {
                setHasActiveRequest(true);
                setActiveRequest(existing);
              } else {
                setHasActiveRequest(false);
                setActiveRequest(null);
              }
            });
        }
      })
      .catch(() => {});
  }, []);

  const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: '', isError: false });

    const userId = localStorage.getItem('userId');
    if (userId && hasActiveRequest) {
      setStatus({ message: 'Active request found. Please cancel it before creating a new one.', isError: true });
      return;
    }

    if (!bdPhoneRegex.test(formData.phone)) {
      setStatus({ message: 'Enter a valid Bangladeshi phone number.', isError: true });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/requests`, formData);
      if (response.status === 201) {
        const generatedId = response.data.requestId;
        setStatus({ message: `Success! Reference ID: ${generatedId}`, isError: false });
        
        // Refresh state
        const reqRes = await axios.get(`${API_BASE}/requests`);
        const existing = (reqRes.data || []).find((r: any) => (r.phone || '').toString() === formData.phone.toString());
        if (existing) {
          setHasActiveRequest(true);
          setActiveRequest(existing);
        }

        setFormData({
          patientName: '', phone: formData.phone, location: '', reason: '', 
          bloodGroup: '', donationTime: '',
          donationDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err: any) {
      setStatus({ message: err.response?.data?.error || 'Submission failed.', isError: true });
    }
  };

  const getProgressPercent = (r: any) => {
    if (!r) return 0;
    const s = (r.status || '').toLowerCase();
    if (s.includes('done')) return 100;
    if (s.includes('accept')) return 75;
    return 25;
  };

  const performCancel = async () => {
    if (!activeRequest) return;
    const id = activeRequest._id || activeRequest.requestId;
    setCancelLoading(true);
    try {
      await axios.delete(`${API_BASE}/requests/${id}`);
      setHasActiveRequest(false);
      setActiveRequest(null);
      setShowCancelModal(false);
      setStatus({ message: 'Request removed.', isError: false });
    } catch (err: any) {
      setStatus({ message: 'Cancel failed.', isError: true });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-900 pb-20 mt-20">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        
        {/* Header Area */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Request <span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-400 font-medium mt-1">Broadcast an emergency to all matching donors</p>
        </div>

        {status.message && (
          <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 border ${
            status.isError ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${status.isError ? 'bg-red-600 animate-pulse' : 'bg-green-600'}`}></div>
            {status.message}
          </div>
        )}

        {/* Active Request Dashboard Component */}
        {activeRequest && (
          <div className="mb-12 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Current Active Posting</p>
                <h3 className="text-2xl font-black text-slate-900">{activeRequest.patientName}</h3>
              </div>
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-2xl font-black border border-red-100">
                {activeRequest.bloodGroup}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercent(activeRequest)}%` }}
                  className="h-full bg-red-600 rounded-full" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                <span>Request Sent</span>
                <span>{getProgressPercent(activeRequest) === 100 ? 'Completed' : 'Donor Searching'}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowCancelModal(true)}
              className="w-full bg-slate-50 text-slate-400 py-4 rounded-3xl font-black hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Cancel This Posting
            </button>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Patient Name</label>
              <input name="patientName" value={formData.patientName} required onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold transition-all" placeholder="Full Name" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Phone</label>
                <input name="phone" type="tel" value={formData.phone} required onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold transition-all" placeholder="01XXXXXXXXX" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} required onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold appearance-none">
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Hospital Location</label>
              <input name="location" value={formData.location} required onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold" placeholder="Hospital Name & Area" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Date</label>
                <input name="donationDate" type="date" required value={formData.donationDate} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Time</label>
                <input name="donationTime" type="time" value={formData.donationTime} required onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500 font-bold" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase ml-2 tracking-widest">Emergency Reason</label>
              <textarea name="reason" value={formData.reason} required onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl h-32 border-none outline-none focus:ring-2 focus:ring-red-500 font-bold resize-none" placeholder="Explain the situation..." />
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-red-600 transition-all shadow-xl shadow-slate-100 transform active:scale-[0.98]"
            >
              Broadcast Request
            </button>
          </form>
        </div>
      </div>

      {/* Modern Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Cancel Posting?</h4>
            <p className="text-slate-400 font-medium mb-8 text-sm leading-relaxed">This will remove your request from the donor feed immediately.</p>
            <div className="flex flex-col gap-3">
              <button onClick={performCancel} disabled={cancelLoading} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all">
                {cancelLoading ? 'Processing...' : 'Yes, Remove It'}
              </button>
              <button onClick={() => setShowCancelModal(false)} className="w-full text-slate-400 font-black text-xs uppercase tracking-widest py-2">Keep Posting</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};