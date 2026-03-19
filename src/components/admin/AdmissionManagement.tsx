import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Check, X, Clock, Search, Filter, MoreVertical, ExternalLink, Phone, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function AdmissionManagement() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        let q = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'));
        if (filter !== 'all') {
          q = query(collection(db, 'admissions'), where('status', '==', filter), orderBy('createdAt', 'desc'));
        }
        const snap = await getDocs(q);
        setAdmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admissions');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'admissions', id), { status });
      setAdmissions(admissions.map(a => a.id === id ? { ...a, status } : a));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `admissions/${id}`);
    }
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      await updateDoc(doc(db, 'admissions', id), { paymentStatus });
      setAdmissions(admissions.map(a => a.id === id ? { ...a, paymentStatus } : a));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `admissions/${id}`);
    }
  };

  const filterLabels: { [key: string]: string } = {
    all: 'সবগুলো',
    pending: 'পেন্ডিং',
    approved: 'অনুমোদিত',
    rejected: 'বাতিল'
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-4">
          <GraduationCap className="text-emerald-500" size={32} /> ভর্তি ব্যবস্থাপনা
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/50 rounded-2xl p-1.5 border border-white/10 backdrop-blur-xl shadow-xl">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {admissions.map((adm) => (
          <motion.div
            key={adm.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group shadow-xl hover:shadow-emerald-500/5 backdrop-blur-3xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                  {adm.studentName?.[0]}
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl group-hover:text-emerald-500 transition-colors leading-tight">{adm.studentName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-widest mt-2">
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg border border-emerald-500/20">{adm.studentClass}</span>
                    <span className="text-slate-700">•</span>
                    <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">{adm.schoolName}</span>
                    <span className="text-slate-700">•</span>
                    <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">{adm.district}</span>
                    <span className="text-slate-700">•</span>
                    <span className="bg-emerald-500/5 text-emerald-500/70 px-3 py-1 rounded-lg border border-emerald-500/10 flex items-center gap-1">
                      <Phone size={10} /> {adm.mobileNumber}
                    </span>
                    <span className="text-slate-700">•</span>
                    <span className="bg-emerald-500/5 text-emerald-500/70 px-3 py-1 rounded-lg border border-emerald-500/10 flex items-center gap-1">
                      <Phone size={10} /> {adm.whatsappNumber} (WA)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">আবেদন তারিখ</div>
                  <div className="text-white font-bold text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">{format(new Date(adm.createdAt), 'MMM dd, yyyy')}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updatePaymentStatus(adm.id, adm.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                      adm.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}
                  >
                    <DollarSign size={14} /> {adm.paymentStatus === 'paid' ? 'পেইড (Paid)' : 'আনপেইড (Unpaid)'}
                  </button>
                  {adm.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateStatus(adm.id, 'approved')}
                        className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-slate-950 transition-all hover:scale-110 active:scale-90 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                        title="অনুমোদন করুন"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => updateStatus(adm.id, 'rejected')}
                        className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all hover:scale-110 active:scale-90 border border-red-500/20 shadow-lg shadow-red-500/5"
                        title="বাতিল করুন"
                      >
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                      adm.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5'
                    }`}>
                      {adm.status === 'approved' ? 'অনুমোদিত' : 'বাতিল'}
                    </div>
                  )}
                  <button className="p-4 hover:bg-white/5 rounded-2xl text-slate-500 transition-all hover:text-white border border-transparent hover:border-white/10">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {admissions.length === 0 && !loading && (
          <div className="p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
            কোনো ভর্তি আবেদন পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
