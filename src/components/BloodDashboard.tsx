import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const BloodDashboard = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const donorId = localStorage.getItem('userId') ;

  useEffect(() => {
    const donorId = localStorage.getItem('userId');
    if (donorId) {
      fetchDonorAndRequests(donorId);
    } else {
      setError('No donor ID found. Please login first.');
    }
  }, []);


  /*
   add the request ID to donors database acceptedRequests string as one donor can 
   only donate to one request at a time and also add the request ID to the queue 
   collection in the backend 
  */
  function AddToQueue(requestId: string) {
    console.log("DonorID:",donorId);
    axios.post(`${API_BASE}/${donorId}/acceptedRequests`, { requestId })
      .then(() => {
        alert('Added to queue successfully!');
        fetchRequests(); // Refresh the list of requests
      })
      .catch(() => {
        setError('Failed to add to queue');
      });
  }


  const fetchDonorAndRequests = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const [donorRes, requestsRes] = await Promise.all([
        axios.get(`${API_BASE}/donors/${id}`),
        axios.get(`${API_BASE}/requests`)
      ]);
      const bloodGrp = donorRes.data?.bloodGroup || '';
      setBloodGroup(bloodGrp);
      setRequests(requestsRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/requests`);
      setRequests(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };


  



  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Matching Blood Requests</h2>

      {loading && <div className="text-sm text-gray-500">Loading your profile and requests...</div>}
      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      {!loading && !error && bloodGroup && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-gray-700">Your Blood Group: <strong className="text-lg text-blue-600">{bloodGroup}</strong></div>
          </div>

          <button onClick={fetchRequests} className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Refresh Requests
          </button>

          <div className="mb-2 text-sm text-gray-700">Found {requests.filter(r => r.bloodGroup === bloodGroup).length} matching request(s)</div>
          <div className="space-y-3">
            {requests.filter(r => r.bloodGroup === bloodGroup).map((r: any, idx: number) => (
              <div key={idx} onClick={() => { AddToQueue(r._id); }} className="p-4 border rounded-lg shadow-sm bg-white  hover:bg-red-200 ">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{r.patientName || 'Unknown Patient'}</div>
                    <div className="text-sm text-gray-600">{r.reason || 'No reason provided'}</div>
                  </div>
                  <div className="text-sm text-gray-500">{r.bloodGroup}</div>
                </div>
                <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
                  <div><strong>Hospital:</strong> {r.location || '-'}</div>
                  <div><strong>Date/Time:</strong> {r.donationDate || '-'} {r.donationTime || ''}</div>
                  <div><strong>Phone:</strong> {r.phone || '-'}</div>
                  <div><strong>Ref:</strong> {r.requestId || r._id || '-'}</div>
                </div>
              </div>
            ))}
            {requests.filter(r => r.bloodGroup === bloodGroup).length === 0 && (
              <div className="text-sm text-gray-600">No matching requests at the moment.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
