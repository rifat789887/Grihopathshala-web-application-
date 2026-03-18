import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'motion/react';
import { GraduationCap, LogIn } from 'lucide-react';

export default function Auth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('লগইন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 bg-emerald-500/10 rounded-[1.5rem] mb-6 relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <GraduationCap className="text-emerald-500 relative z-10" size={56} />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">স্বাগতম</h1>
          <p className="text-slate-400 text-center text-lg">আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-4 bg-white text-slate-950 py-5 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all disabled:opacity-50 shadow-xl shadow-white/5 active:scale-95"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full"
            ></motion.div>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              গুগল দিয়ে লগইন
            </>
          )}
        </button>

        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            লগইন করার মাধ্যমে আপনি আমাদের <span className="text-emerald-500/50">শর্তাবলী</span> এবং <span className="text-emerald-500/50">গোপনীয়তা নীতি</span> মেনে নিচ্ছেন।
          </p>
        </div>
      </motion.div>
    </div>
  );
}
