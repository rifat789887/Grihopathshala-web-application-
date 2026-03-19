import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, query, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Plus, Search, Download, CheckCircle, Clock, X, Printer, Award, FileText, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

export default function FeeManagement() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    userId: '',
    studentName: '',
    amount: 0,
    status: 'paid',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [viewType, setViewType] = useState<'receipt' | 'certificate' | null>(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const q = query(collection(db, 'fees'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        setFees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'fees');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const receiptId = 'GP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const feeData = { ...newFee, receiptId, date: new Date(newFee.date).toISOString() };
      const docRef = await addDoc(collection(db, 'fees'), feeData);
      setFees([{ id: docRef.id, ...feeData }, ...fees]);
      setIsModalOpen(false);
      setNewFee({ userId: '', studentName: '', amount: 0, status: 'paid', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'fees');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-4">
          <CreditCard className="text-emerald-500" size={32} /> ফি ব্যবস্থাপনা
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
        >
          <Plus size={20} /> নতুন ফি রেকর্ড যোগ করুন
        </button>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">শিক্ষার্থী</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">পরিমাণ</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">অবস্থা</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">তারিখ</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-white/5 transition-all group">
                  <td className="p-8">
                    <div className="text-white font-black text-lg group-hover:text-emerald-500 transition-colors">{fee.studentName}</div>
                    <div className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">{fee.receiptId}</div>
                  </td>
                  <td className="p-8">
                    <div className="text-emerald-500 font-black text-xl">৳{fee.amount}</div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${
                      fee.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {fee.status === 'paid' ? 'পরিশোধিত' : 'বাকি'}
                    </span>
                  </td>
                  <td className="p-8 text-slate-400 font-bold text-sm">
                    {format(new Date(fee.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setSelectedFee(fee); setViewType('receipt'); }}
                        className="p-3 bg-white/5 hover:bg-emerald-500/10 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all border border-white/5 hover:border-emerald-500/30"
                        title="রশিদ দেখুন"
                      >
                        <FileText size={20} />
                      </button>
                      <button
                        onClick={() => { setSelectedFee(fee); setViewType('certificate'); }}
                        className="p-3 bg-white/5 hover:bg-amber-500/10 rounded-2xl text-slate-400 hover:text-amber-500 transition-all border border-white/5 hover:border-amber-500/30"
                        title="সার্টিফিকেট তৈরি করুন"
                      >
                        <Award size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fee Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white">ফি রেকর্ড যোগ করুন</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><X size={28} /></button>
              </div>
              <form onSubmit={handleAddFee} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">শিক্ষার্থীর নাম</label>
                  <input
                    required
                    type="text"
                    value={newFee.studentName}
                    onChange={(e) => setNewFee({ ...newFee, studentName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="শিক্ষার্থীর পূর্ণ নাম"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">ইউজার আইডি</label>
                  <input
                    required
                    type="text"
                    value={newFee.userId}
                    onChange={(e) => setNewFee({ ...newFee, userId: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="ইউজার আইডি লিখুন"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">পরিমাণ (৳)</label>
                    <input
                      required
                      type="number"
                      value={newFee.amount}
                      onChange={(e) => setNewFee({ ...newFee, amount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                      placeholder="৳০০০"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">তারিখ</label>
                    <input
                      required
                      type="date"
                      value={newFee.date}
                      onChange={(e) => setNewFee({ ...newFee, date: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20">
                  রেকর্ড সংরক্ষণ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document View Modal */}
      <AnimatePresence>
        {selectedFee && viewType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="bg-white text-slate-950 p-12 md:p-16 rounded-[3rem] w-full max-w-3xl shadow-2xl relative my-8"
            >
              <button onClick={() => { setSelectedFee(null); setViewType(null); }} className="absolute top-8 right-8 p-3 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-2xl transition-all"><X size={28} /></button>
              
              {viewType === 'receipt' ? (
                <div className="space-y-12">
                  <div className="flex flex-wrap justify-between items-start border-b-4 border-slate-100 pb-10 gap-6">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-emerald-600">গৃহপাঠশালা</h2>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mt-1">পেমেন্ট রশিদ</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">রশিদ আইডি</div>
                      <div className="text-2xl font-mono font-black text-slate-900">{selectedFee.receiptId}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">শিক্ষার্থীর তথ্য</div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-slate-900">{selectedFee.studentName}</div>
                        <div className="text-sm text-slate-500 font-bold">ইউজার আইডি: {selectedFee.userId}</div>
                      </div>
                    </div>
                    <div className="md:text-right space-y-4">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">ইস্যু করার তারিখ</div>
                      <div className="text-2xl font-black text-slate-900">{format(new Date(selectedFee.date), 'MMMM dd, yyyy')}</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-[2.5rem] p-10 flex flex-wrap justify-between items-center gap-6 border-2 border-slate-100">
                    <span className="text-slate-500 font-black text-lg">মোট পরিশোধিত পরিমাণ</span>
                    <span className="text-5xl font-black text-emerald-600">৳{selectedFee.amount}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center pt-10 border-t-4 border-slate-100 gap-6">
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-xl">
                      <CheckCircle size={28} /> পেমেন্ট নিশ্চিত করা হয়েছে
                    </div>
                    <button onClick={() => window.print()} className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                      <Printer size={22} /> রশিদ প্রিন্ট করুন
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-12 py-16 border-[12px] border-double border-emerald-500/10 rounded-[4rem] relative overflow-hidden">
                  <div className="absolute top-10 left-10 opacity-[0.03] -rotate-12"><Award size={300} /></div>
                  <div className="space-y-4 relative z-10">
                    <h2 className="text-6xl font-black text-emerald-600 tracking-tight">সার্টিফিকেট</h2>
                    <p className="text-slate-500 font-black tracking-[0.4em] uppercase text-sm">সাফল্য এবং কৃতিত্বের স্বীকৃতি</p>
                  </div>
                  <div className="space-y-8 relative z-10">
                    <p className="text-slate-500 italic text-xl font-serif">এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,</p>
                    <h3 className="text-6xl font-serif font-black text-slate-900 border-b-2 border-slate-200 inline-block pb-4 px-10">{selectedFee.studentName}</h3>
                    <p className="text-slate-500 max-w-xl mx-auto leading-relaxed text-lg font-medium">
                      সফলভাবে প্রয়োজনীয় কোর্স মডিউল সম্পন্ন করেছেন এবং {format(new Date(selectedFee.date), 'yyyy')} সেশনের সকল আর্থিক বাধ্যবাধকতা পূরণ করেছেন।
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-around items-end pt-16 gap-12 relative z-10">
                    <div className="text-center space-y-3">
                      <div className="w-48 h-1 bg-slate-200 rounded-full"></div>
                      <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">পরিচালক</div>
                    </div>
                    <div className="p-8 bg-emerald-500/5 rounded-full border-4 border-emerald-500/10 shadow-inner">
                      <GraduationCap size={72} className="text-emerald-500" />
                    </div>
                    <div className="text-center space-y-3">
                      <div className="w-48 h-1 bg-slate-200 rounded-full"></div>
                      <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">রেজিস্ট্রার</div>
                    </div>
                  </div>
                  <button onClick={() => window.print()} className="mt-12 flex items-center gap-3 bg-emerald-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-xl hover:bg-emerald-700 transition-all mx-auto shadow-2xl shadow-emerald-600/30 hover:scale-105 active:scale-95">
                    <Download size={24} /> সার্টিফিকেট ডাউনলোড করুন
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
