import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Calendar, Search, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

export default function NoticeBoard() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      const q = query(collection(db, 'notices'), where('active', '==', true), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (n.content && n.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <Helmet>
        <title>নোটিশ বোর্ড | গৃহপাঠশালা - আপনার অনলাইন শিক্ষা সঙ্গী</title>
        <meta name="description" content="গৃহপাঠশালার সর্বশেষ নোটিশ এবং ঘোষণাগুলো এখানে দেখুন। পরীক্ষার রুটিন, ছুটির নোটিশ এবং অন্যান্য গুরুত্বপূর্ণ আপডেট।" />
      </Helmet>
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-white tracking-tight flex items-center justify-center gap-6">
          <Bell className="text-emerald-500 animate-swing" size={56} /> নোটিশ বোর্ড
        </h1>
        <p className="text-slate-400 text-lg font-medium">গৃহপাঠশালার সর্বশেষ ঘোষণা এবং খবরের সাথে আপডেট থাকুন।</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={24} />
        <input
          type="text"
          placeholder="নোটিশ খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] pl-16 pr-6 py-5 text-white focus:border-emerald-500 outline-none transition-all shadow-2xl backdrop-blur-xl font-bold"
        />
      </div>

      <div className="space-y-6">
        {filteredNotices.map((notice, i) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all hover:border-emerald-500/30 shadow-xl ${expandedId === notice.id ? 'ring-2 ring-emerald-500/20 bg-slate-900/80 shadow-emerald-500/5' : ''}`}
          >
            <button
              onClick={() => setExpandedId(expandedId === notice.id ? null : notice.id)}
              className="w-full text-left p-8 flex items-center justify-between hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-[1.5rem] text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                  <span className="text-xs font-black uppercase tracking-widest mb-1">{format(new Date(notice.date), 'MMM')}</span>
                  <span className="text-3xl font-black">{format(new Date(notice.date), 'dd')}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-500 transition-colors leading-tight">{notice.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-widest">
                    <Calendar size={14} className="text-emerald-500" /> {format(new Date(notice.date), 'yyyy')}
                  </div>
                </div>
              </div>
              <div className="text-slate-500 group-hover:text-emerald-500 transition-colors">
                {expandedId === notice.id ? <ChevronUp size={32} /> : <ChevronDown size={32} />}
              </div>
            </button>
            <AnimatePresence>
              {expandedId === notice.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 pb-10 pt-4 border-t border-white/5"
                >
                  <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                    {notice.content}
                  </div>
                  <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-6 justify-between items-center text-xs text-slate-500 font-black uppercase tracking-widest">
                    <span className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">নোটিশ আইডি: {notice.id}</span>
                    <button className="flex items-center gap-3 text-emerald-500 hover:text-emerald-400 bg-emerald-500/5 px-5 py-2.5 rounded-xl border border-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                      <FileText size={18} /> পিডিএফ ডাউনলোড করুন
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {filteredNotices.length === 0 && !loading && (
          <div className="p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
            আপনার অনুসন্ধানের সাথে মিলছে এমন কোনো নোটিশ পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
