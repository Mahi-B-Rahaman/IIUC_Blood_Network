import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const BloodDashboard = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  
  // Get donorId inside the component to ensure it's reactive
  const donorId = localStorage.getItem('userId');

  useEffect(() => {
    if (donorId) {
      fetchDonorAndRequests(donorId);
    } else {
      setError('No donor ID found. Please login first.');
    }
  }, [donorId]);

  // FIX: Standardize the API endpoint for accepting requests
  function AddToQueue(requestId: string) {
    if (!donorId) return alert("Please login to accept requests");
    
    setLoading(true);
    // Note: Adjusted the URL to a more standard structure: /api/donors/:id/accept
    axios.post(`${API_BASE}/donors/${donorId}/accept`, { requestId })
      .then(() => {
        alert('You have successfully accepted this request!');
        fetchRequests(); 
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to add to queue');
      })
      .finally(() => setLoading(false));
  }

  const fetchDonorAndRequests = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const [donorRes, requestsRes] = await Promise.all([
        axios.get(`${API_BASE}/donors/${id}`),
        axios.get(`${API_BASE}/requests`)
      ]);
      
      const bGrp = donorRes.data?.bloodGroup || '';
      const gen = donorRes.data?.gender || '';
      const phoneVal = donorRes.data?.phone || '';
      
      setBloodGroup(bGrp);
      setGender(gen);
      setDonorPhone(phoneVal);

      // Prompt update if profile is incomplete
      if (!bGrp || !gen) {
        setShowUpdateForm(true);
      }
      
      setRequests(requestsRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/requests`);
      setRequests(res.data || []);
    } catch (err: any) {
      setError('Could not refresh requests');
    }
  };

  const updateDonorProfile = async (e: any) => {
    e.preventDefault();
    if (!donorId) return;
    setLoading(true);
    try {
      await axios.put(`${API_BASE}/donors/${donorId}`, { bloodGroup, gender });
      setShowUpdateForm(false);
      fetchDonorAndRequests(donorId);
    } catch (err: any) {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format the ISO date from MongoDB into readable text
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB');
    } catch {
      return dateStr;
    }
  };

  // Only show requests that match donor blood group and have a different phone
  const matchingRequests = requests.filter(r => {
    const reqPhone = (r.phone || '').toString();
    return r.bloodGroup === bloodGroup && reqPhone !== donorPhone;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-red-600">Blood Match Center</h2>
        {bloodGroup && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-lg">
            My Group: {bloodGroup}
          </div>
        )}
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center border border-red-200">
          {error}
        </div>
      )}

      {showUpdateForm ? (
        <div className="bg-white shadow-xl border border-yellow-200 p-6 rounded-2xl mb-8">
           <h3 className="text-lg font-bold text-yellow-700 mb-4">Complete Your Profile</h3>
           <form onSubmit={updateDonorProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required className="p-3 border rounded-xl">
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={gender} onChange={e => setGender(e.target.value)} required className="p-3 border rounded-xl">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <button type="submit" className="md:col-span-2 bg-green-600 text-white p-3 rounded-xl font-bold">Update Profile</button>
           </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-600 font-medium">Available matching requests:</h3>
            <button onClick={fetchRequests} className="text-sm text-blue-600 hover:underline">Refresh List</button>
          </div>

          <div className="grid gap-4">
            {matchingRequests.map((r) => (
                <div 
                  key={r._id} 
                  className="bg-white border-2 border-transparent hover:border-red-300 p-5 rounded-2xl shadow-sm transition-all cursor-pointer relative group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{r.patientName}</h4>
                      <p className="text-gray-500 text-sm mt-1">{r.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-600 font-black text-2xl">{r.bloodGroup}</span>
                      <p className="text-xs text-gray-400">Reference: {r.requestId || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600">
                    <div><span className="font-bold">Hospital:</span> {r.location}</div>
                    <div><span className="font-bold">Date:</span> {formatDate(r.donationDate)}</div>
                    <div><span className="font-bold">Time:</span> {r.donationTime}</div>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); AddToQueue(r._id); }}
                    className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Accept & Connect
                  </button>
                </div>
              ))}
              
            {matchingRequests.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-2xl text-gray-400">
                No matching blood requests found for your group at this time.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};