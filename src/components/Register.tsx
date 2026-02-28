import React, { createContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
export const UserContext = createContext(null);

const Register: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', isError: false });
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        bloodGroup: '',
        phone: '',
        gender: '',
        otp: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggleDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setShowDetails(checked);
        if (!checked) setFormData({ ...formData, bloodGroup: '', gender: '' });
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', isError: false });

        if (showDetails && (!formData.bloodGroup || !formData.gender)) {
            setStatus({ message: 'Please select blood group and gender.', isError: true });
            setLoading(false);
            return;
        }

        try {
            let phoneToSend = String(formData.phone).replace(/\s|-/g, '');
            if (!phoneToSend.startsWith('+88')) {
                if (phoneToSend.startsWith('0')) phoneToSend = '+88' + phoneToSend;
                else if (phoneToSend.startsWith('88')) phoneToSend = '+' + phoneToSend;
                else phoneToSend = '+88' + phoneToSend;
            }
            setFormData({ ...formData, phone: phoneToSend });

            const response = await axios.post(`${API_BASE}/send-otp`, { phone: phoneToSend });
            if (response.status === 200) {
                setStatus({ message: "OTP sent successfully!", isError: false });
                setStep(2);
            }
        } catch (err: any) {
            setStatus({
                message: err.response?.data?.error || "Failed to send OTP.",
                isError: true
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFinalRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE}/register`, formData);
            if (response.status === 201) {
                setStatus({ message: "Account created successfully! Please login.", isError: false });
                setTimeout(() => navigate('/login'), 2000);
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
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 overflow-hidden font-sans">
            
            {/* Geometric Background Decorations */}
            <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

            <div className="relative w-full max-w-lg px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                        IIUC <span className="text-red-600 underline decoration-red-200 underline-offset-4">Blood Network</span>
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Join our life-saving community today</p>
                </div>

                {/* Registration Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 transition-all duration-500">
                    
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step === 1 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
                        <div className={`h-2 w-12 rounded-full transition-all duration-300 ${step === 2 ? 'bg-red-600' : 'bg-gray-200'}`}></div>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold animate-in fade-in zoom-in duration-300 ${status.isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {status.message}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-red-500 transition-colors">Full Name</label>
                                <input
                                    name="name"
                                    placeholder="John Doe"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-400 focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-red-500 transition-colors">Phone Number</label>
                                <input
                                    name="phone"
                                    placeholder="01XXXXXXXXX"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-400 focus:bg-white outline-none transition-all"
                                />
                            </div>

                            <div className="group relative">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 group-focus-within:text-red-500 transition-colors">Password</label>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-red-400 focus:bg-white outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 bottom-3 text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>

                            {/* Donor Details Toggle */}
                            <div className="py-2">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={showDetails}
                                        onChange={handleToggleDetails}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    <span className="ml-3 text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">I am a blood donor</span>
                                </label>
                            </div>

                            {showDetails && (
                                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                    <select
                                        name="bloodGroup"
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-400 outline-none font-semibold text-red-700 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                    <select
                                        name="gender"
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl focus:ring-2 focus:ring-red-400 outline-none font-semibold text-red-700 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-100 hover:shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? "Sending OTP..." : "Continue to Verification"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleFinalRegister} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-4 font-medium">
                                    A 6-digit code has been sent to<br/>
                                    <span className="text-red-600 font-bold">{formData.phone}</span>
                                </p>
                                <input
                                    name="otp"
                                    placeholder="000000"
                                    onChange={handleChange}
                                    maxLength={6}
                                    required
                                    className="w-full px-4 py-5 bg-gray-50 border-2 border-red-100 rounded-2xl text-center text-4xl tracking-[0.2em] font-black focus:border-red-500 focus:bg-white outline-none transition-all text-gray-800"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 hover:shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {loading ? "Verifying..." : "Create My Account"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                            >
                                ← Edit Information
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            Already have an account?{' '}
                            <Link to="/" className="text-red-600 font-bold hover:text-red-700 underline-offset-4 hover:underline">
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;