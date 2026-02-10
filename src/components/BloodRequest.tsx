import React, { useState } from 'react';
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

  // Regex for Bangladeshi phone numbers (01 followed by 9 digits)
  const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: '', isError: false });

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

