import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE ;

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

  // If user is logged in, prefill phone and check existing requests
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // fetch donor profile to get phone, then find any active request for that phone
    axios.get(`${API_BASE}/donors/${userId}`)
      .then(res => {
        const phone = res.data?.phone;
        if (phone) {
          setFormData(prev => ({ ...prev, phone }));
          // fetch requests and pick the most recent active one for this phone
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
      .catch(() => {
        // ignore errors silently
      });
  }, []);

  // Regex for Bangladeshi phone numbers (01 followed by 9 digits)
  const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: '', isError: false });

    // Prevent multiple active requests for same logged-in user
    const userId = localStorage.getItem('userId');
    if (userId && hasActiveRequest) {
      setStatus({ message: 'You already have an active request. Please cancel it before creating a new one.', isError: true });
      return;
    }

    // Validate Bangladeshi Phone Format
    if (!bdPhoneRegex.test(formData.phone)) {
      setStatus({ message: 'Please enter a valid Bangladeshi phone number (01XXXXXXXXX).', isError: true });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/requests`, formData);
      if (response.status === 201) {
        // Access the generated B-XXXXXX ID from the backend
        const generatedId = response.data.requestId;
        setStatus({ 
          message: `Urgent Request Created! Reference ID: ${generatedId}`, 
          isError: false 
        });
        // Mark that this user now has an active request
        // Refresh requests and set the activeRequest to the newly created one
        try {
          const reqRes = await axios.get(`${API_BASE}/requests`);
          const requests = reqRes.data || [];
          const phone = formData.phone?.toString();
          const existing = requests.find((r: any) => (r.phone || '').toString() === phone);
          if (existing) {
            setHasActiveRequest(true);
            setActiveRequest(existing);
          }
        } catch {
          // ignore
        }
        // Clear form after success
        setFormData({
            patientName: '', phone: '', location: '', reason: '', 
            bloodGroup: '', donationTime: '',
            donationDate: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err: any) {
      setStatus({ 
        message: err.response?.data?.error || 'Failed to submit request. Please try again.', 
        isError: true 
      });
    }
  };

  const getProgressPercent = (r: any) => {
    if (!r) return 0;
    if (typeof r.progress === 'number') return Math.min(100, Math.max(0, r.progress));
    const s = (r.status || r.stage || '').toString().toLowerCase();
    if (s.includes('completed') || s.includes('done')) return 100;
    if (s.includes('accepted') || s.includes('confirmed')) return 75;
    if (s.includes('cancel')) return 0;
    return 25; // pending/created
  };

  const openCancelModal = () => {
    if (!activeRequest) return;
    setShowCancelModal(true);
  };

  const performCancel = async () => {
    if (!activeRequest) return;
    const id = activeRequest._id || activeRequest.requestId;
    if (!id) return setStatus({ message: 'Cannot cancel - invalid request id', isError: true });

    setCancelLoading(true);
    try {
      await axios.delete(`${API_BASE}/requests/${id}`);
      setStatus({ message: 'Request cancelled successfully', isError: false });
      setHasActiveRequest(false);
      setActiveRequest(null);
      setShowCancelModal(false);
    } catch (err: any) {
      setStatus({ message: err.response?.data?.error || 'Failed to cancel request', isError: true });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-red-50"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-red-600">Blood Emergency</h2>
        <p className="text-gray-500 text-sm mt-1">Fill out the details for a new request</p>
      </div>
      
      {status.message && (
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`p-4 mb-6 rounded-lg text-sm font-medium text-center ${
            status.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {status.message}
        </motion.div>
      )}

      {activeRequest && (
        <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Active Request</h3>
          <div className="text-xs text-gray-600 mb-2">Ref: {activeRequest.requestId || activeRequest._id || 'N/A'}</div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
            <div><strong>Patient:</strong> {activeRequest.patientName || '-'}</div>
            <div><strong>Group:</strong> {activeRequest.bloodGroup || '-'}</div>
            <div><strong>Hospital:</strong> {activeRequest.location || '-'}</div>
            <div><strong>When:</strong> {activeRequest.donationDate || '-'} {activeRequest.donationTime || ''}</div>
          </div>
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 bg-red-600 rounded-full" style={{ width: `${getProgressPercent(activeRequest)}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">Status: {activeRequest.status || (getProgressPercent(activeRequest) === 100 ? 'Completed' : 'Pending')}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={openCancelModal} disabled={cancelLoading} className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200">
              {cancelLoading ? 'Cancelling...' : 'Cancel Request'}
            </button>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h4 className="text-lg font-semibold mb-2">Cancel Request</h4>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to cancel your active blood request? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelModal(false)} className="px-3 py-2 rounded-md bg-gray-100">Close</button>
              <button onClick={performCancel} disabled={cancelLoading} className="px-3 py-2 rounded-md bg-red-600 text-white">
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Name*</label>
          <input name="patientName" value={formData.patientName} required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="Enter Full Name" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number*</label>
          <input name="phone" type="tel" value={formData.phone} required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="01XXXXXXXXX" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group*</label>
            <select name="bloodGroup" value={formData.bloodGroup} required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none">
              <option value="">Select</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hospital Location*</label>
            <input name="location" value={formData.location} required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" placeholder="Hospital Name" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Required Date*</label>
            <input name="donationDate" type="date" required value={formData.donationDate} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Required Time*</label>
            <input name="donationTime" type="time" value={formData.donationTime} required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Emergency*</label>
          <textarea name="reason" value={formData.reason} required onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-28 focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Surgery, Accident, etc." />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
        >
          Submit Urgent Request
        </motion.button>
      </form>
    </motion.div>
  );
};

