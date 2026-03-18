import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Plus, Trash2, Edit2, Check, X, Clock, User as UserIcon, BookOpen } from 'lucide-react';

export default function RoutineManagement() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [formData, setFormData] = useState({
    day: 'শনিবার',
    time: '',
    subject: '',
    teacher: '',
  });

  useEffect(() => {
    const fetchRoutines = async () => {
      const q = query(collection(db, 'routines'), orderBy('day', 'asc'));
      const snap = await getDocs(q);
      setRoutines(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchRoutines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoutine) {
      await updateDoc(doc(db, 'routines', editingRoutine.id), formData);
      setRoutines(routines.map(r => r.id === editingRoutine.id ? { ...r, ...formData } : r));
    } else {
      const docRef = await addDoc(collection(db, 'routines'), formData);
      setRoutines([...routines, { id: docRef.id, ...formData }]);
    }
    setIsModalOpen(false);
    setEditingRoutine(null);
    setFormData({ day: 'শনিবার', time: '', subject: '', teacher: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই রুটিন এন্ট্রিটি মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, 'routines', id));
      setRoutines(routines.filter(r => r.id !== id));
    }
  };

  const days = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-4">
          <Calendar className="text-emerald-500" size={32} /> রুটিন ব্যবস্থাপনা
        </h2>
        <button
          onClick={() => { setEditingRoutine(null); setFormData({ day: 'শনিবার', time: '', subject: '', teacher: '' }); setIsModalOpen(true); }}
          className="bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
        >
          <Plus size={20} /> নতুন রুটিন যোগ করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {days.map((day) => (
          <div key={day} className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl backdrop-blur-3xl hover:border-emerald-500/30 transition-all group">
            <h3 className="text-xl font-black text-emerald-500 uppercase tracking-[0.2em] border-b border-white/5 pb-4 group-hover:text-white transition-colors">{day}</h3>
            <div className="space-y-4">
              {routines.filter(r => r.day === day).length > 0 ? routines.filter(r => r.day === day).map((r) => (
                <div key={r.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 group/item relative hover:bg-white/10 transition-all shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-white font-black text-lg group-hover/item:text-emerald-500 transition-colors">{r.subject}</div>
                    <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all translate-x-2 group-hover/item:translate-x-0">
                      <button onClick={() => { setEditingRoutine(r); setFormData({ ...r }); setIsModalOpen(true); }} className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Clock size={14} className="text-emerald-500" /> {r.time}</div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><UserIcon size={14} className="text-emerald-500" /> {r.teacher}</div>
                  </div>
                </div>
              )) : <p className="text-slate-600 text-sm font-medium italic p-4 text-center bg-white/5 rounded-2xl border border-dashed border-white/5">কোনো ক্লাস নেই।</p>}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white">{editingRoutine ? 'রুটিন সম্পাদনা' : 'নতুন রুটিন যোগ করুন'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} className="text-emerald-500" /> সপ্তাহের দিন</label>
                  <select
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold appearance-none"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} className="text-emerald-500" /> বিষয়</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="উদা: আইসিটি, পদার্থবিজ্ঞান"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={14} className="text-emerald-500" /> সময়</label>
                    <input
                      required
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                      placeholder="উদা: ১০:০০ AM"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><UserIcon size={14} className="text-emerald-500" /> শিক্ষক</label>
                    <input
                      required
                      type="text"
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                      placeholder="শিক্ষকের নাম"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20">
                  {editingRoutine ? 'রুটিন আপডেট করুন' : 'রুটিন তৈরি করুন'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
