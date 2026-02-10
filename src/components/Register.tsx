import React, { createContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



// Ensure this matches your local backend port
const API_BASE = import.meta.env.VITE_API_BASE;
export const UserContext =createContext(null);

const Register: React.FC = () => {
    // step 1: Collect details & Send OTP | step 2: Verify OTP & Register
    const [step, setStep] = useState<1 | 2 >(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', isError: false });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bloodGroup: '',
        phone: '',
        gender: '',
        otp: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 1: Trigger the SMS service
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', isError: false });

        try {
            const response = await axios.post(`${API_BASE}/send-otp`, { phone: formData.phone });
            if (response.status === 200) {
                setStatus({ message: "OTP sent successfully!", isError: false });
                setStep(2);
            }
        } catch (err: any) {
            setStatus({ 
                message: err.response?.data?.error || "Failed to send OTP. Check console.", 
                isError: true 
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Final Registration
    const handleFinalRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sends all fields including the OTP
            const response = await axios.post(`${API_BASE}/register`, formData);
            if (response.status === 201) {
                setStatus({ message: "Account created successfully!", isError: false });
            }
        } catch (err: any) {
            setStatus({ 
                message: err.response?.data?.error || "Registration failed.", 
                isError: true 
            });
        } finally {
            setLoading(false);
        }
    };







    return (
        
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-3xl font-extrabold text-center text-red-600 mb-2">IIUC_Blood.net</h2>
                <p className="text-center text-gray-500 mb-6">Donor Registration Portal</p>

                {status.message && (
                    <div className={`mb-4 p-3 rounded text-sm font-medium ${status.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {status.message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <input name="name" placeholder="Full Name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                        <div className="relative">
                            <input 
                                name="password" 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Create Password" 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 text-sm">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <select name="bloodGroup" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="">Blood Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                            <select name="gender" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <input name="phone" placeholder="Phone (e.g., 01XXXXXXXXX)" onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />

                        <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400">
                            {loading ? "Sending..." : "Request OTP"}
                        </button>
                        <p className="text-sm text-gray-500 text-center"> Already have an account? <Link to="/" className="text-red-600 font-semibold hover:underline">Login</Link></p>
                        
                    </form>
                
                ) : (
                    <form onSubmit={handleFinalRegister} className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Verification code sent to <b>{formData.phone}</b></p>
                            <input 
                                name="otp" 
                                placeholder="Enter 6-digit OTP" 
                                onChange={handleChange} 
                                maxLength={6}
                                required 
                                className="w-full px-4 py-3 border-2 border-red-200 rounded-lg text-center text-2xl tracking-[0.5em] font-bold focus:border-red-500 outline-none" 
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
                            {loading ? "Verifying..." : "Complete Registration"}
                        </button>
                        
                        <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-red-600 transition">
                            Back to Edit Information
                        </button>
                    </form>
                )}
            </div>
        </div>
        
        
        
        
        </>
            
    );
};

export default Register;