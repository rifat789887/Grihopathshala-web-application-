import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Plus, Trash2, Edit2, Check, X, Search, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function NoticeManagement() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    active: true,
  });

  useEffect(() => {
    const fetchNotices = async () => {
      const q = query(collection(db, 'notices'), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const noticeData = { ...formData, date: new Date(formData.date).toISOString() };
    if (editingNotice) {
      await updateDoc(doc(db, 'notices', editingNotice.id), noticeData);
      setNotices(notices.map(n => n.id === editingNotice.id ? { ...n, ...noticeData } : n));
    } else {
      const docRef = await addDoc(collection(db, 'notices'), noticeData);
      setNotices([{ id: docRef.id, ...noticeData }, ...notices]);
    }
    setIsModalOpen(false);
    setEditingNotice(null);
    setFormData({ title: '', content: '', date: new Date().toISOString().split('T')[0], active: true });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই নোটিশটি মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, 'notices', id));
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-4">
          <Bell className="text-emerald-500" size={32} /> নোটিশ ব্যবস্থাপনা
        </h2>
        <button
          onClick={() => { setEditingNotice(null); setFormData({ title: '', content: '', date: new Date().toISOString().split('T')[0], active: true }); setIsModalOpen(true); }}
          className="bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
        >
          <Plus size={20} /> নতুন নোটিশ যোগ করুন
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {notices.map((notice) => (
          <motion.div
            key={notice.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group shadow-xl hover:shadow-emerald-500/5 backdrop-blur-3xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-lg border border-white/5">{format(new Date(notice.date), 'MMM dd, yyyy')}</span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${notice.active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${notice.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{notice.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                  </div>
                </div>
                <h3 className="text-white font-black text-2xl group-hover:text-emerald-500 transition-colors leading-tight">{notice.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 font-medium leading-relaxed">{notice.content}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setEditingNotice(notice); setFormData({ ...notice, date: new Date(notice.date).toISOString().split('T')[0] }); setIsModalOpen(true); }}
                  className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {notices.length === 0 && !loading && (
          <div className="p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
            এখনও কোনো নোটিশ পোস্ট করা হয়নি।
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-2xl shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white">{editingNotice ? 'নোটিশ সম্পাদনা' : 'নতুন নোটিশ যোগ করুন'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Bell size={14} className="text-emerald-500" /> নোটিশের শিরোনাম</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} className="text-emerald-500" /> তারিখ</label>
                    <input
                      required
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold appearance-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-emerald-500" /> বিষয়বস্তু</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none resize-none transition-all font-medium leading-relaxed"
                  />
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-6 h-6 rounded-lg bg-slate-950 border-white/10 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
                  />
                  <label htmlFor="active" className="text-sm text-slate-300 font-black uppercase tracking-widest cursor-pointer">সক্রিয় (সবার জন্য দৃশ্যমান)</label>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20">
                  {editingNotice ? 'নোটিশ আপডেট করুন' : 'নোটিশ পোস্ট করুন'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
