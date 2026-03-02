import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const MainPage = () => {
  const { userId, isLoggedIn } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
                Save Lives<br />
                <span className="text-red-600">One Drop.</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl font-medium leading-relaxed">
                IIUC Blood Network connects donors and recipients in emergencies. Help save lives by donating blood or request when you need it most.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/blooddashboard"
                    className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-2xl transition-all hover:shadow-lg hover:shadow-red-600/50 text-sm"
                  >
                    View Match Requests
                  </Link>
                  <Link
                    to="/bloodrequest"
                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-wider rounded-2xl transition-all text-sm"
                  >
                    Request Blood
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-2xl transition-all hover:shadow-lg hover:shadow-red-600/50 text-sm"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-wider rounded-2xl transition-all text-sm"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-slate-700">
            <div>
              <p className="text-4xl font-black text-red-600">8+</p>
              <p className="text-slate-400 font-medium text-sm uppercase tracking-wider mt-1">Blood Types</p>
            </div>
            <div>
              <p className="text-4xl font-black text-red-600">24/7</p>
              <p className="text-slate-400 font-medium text-sm uppercase tracking-wider mt-1">Emergency Support</p>
            </div>
            <div>
              <p className="text-4xl font-black text-red-600">Lives</p>
              <p className="text-slate-400 font-medium text-sm uppercase tracking-wider mt-1">Being Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4">
              How It Works<span className="text-red-600">.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">Simple steps to make a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 hover:border-red-600 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl font-black text-white">1</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Create Account</h3>
              <p className="text-slate-600 font-medium">Register as a donor or recipient. Provide your blood type and emergency contact information.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 hover:border-red-600 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl font-black text-white">2</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Find Matches</h3>
              <p className="text-slate-600 font-medium">View all blood requests in real-time. See who needs your help and respond instantly.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 hover:border-red-600 transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl font-black text-white">3</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Save Lives</h3>
              <p className="text-slate-600 font-medium">Connect with recipients or donors. Coordinate and make a direct impact on someone's life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types Info Section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4">
              Blood Types<span className="text-red-600">.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">Universal donors and recipients</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
              <div key={type} className="bg-white border-2 border-slate-100 rounded-2xl p-6 text-center hover:border-red-600 transition-all">
                <p className="text-3xl font-black text-red-600 mb-2">{type}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {type === 'O+' ? 'Universal' : type === 'AB-' ? 'Rare' : 'Common'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6">
                Why Donate<span className="text-red-600">?</span>
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-black text-xs">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium">One pint of blood can save up to 3 lives</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-black text-xs">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium">Donors can give blood every 8 weeks safely</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-black text-xs">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium">No substitute for human blood in emergencies</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-black text-xs">✓</span>
                  </div>
                  <p className="text-slate-700 font-medium">Be a hero in your community instantly</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-[2rem] p-12 text-white">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-red-100 mb-2">Impact</p>
                  <p className="text-4xl font-black">Every Drop Matters</p>
                </div>
                <p className="text-red-100 font-medium leading-relaxed">
                  Join thousands of donors who have made a direct impact. Your blood donation could be the difference between life and death.
                </p>
                {!isLoggedIn && (
                  <Link
                    to="/register"
                    className="inline-block mt-4 px-6 py-3 bg-white text-red-600 font-black uppercase tracking-wider rounded-xl hover:bg-red-50 transition-all"
                  >
                    Start Donating Today
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-black tracking-tight text-white mb-6">
            Ready to Help<span className="text-red-600">?</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
            Join our blood network community. It takes just 5 minutes to get started.
          </p>
          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-2xl transition-all hover:shadow-lg hover:shadow-red-600/50"
              >
                Register Now
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-black uppercase tracking-wider rounded-2xl transition-all"
              >
                Learn More
              </Link>
            </div>
          ) : (
            <div className="text-slate-300 font-medium">
              Welcome back, {userId}! <Link to="/blooddashboard" className="text-red-600 font-black">View your dashboard</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
