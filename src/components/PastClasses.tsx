import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { PlayCircle, Search, Calendar, Play, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function PastClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      const q = query(collection(db, 'classes'), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      setClasses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-white tracking-tight flex items-center justify-center gap-6">
          <PlayCircle className="text-emerald-500 animate-spin-slow" size={56} /> পূর্ববর্তী লাইভ ক্লাস
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">ক্লাস মিস করেছেন? কোনো সমস্যা নেই। আমাদের রেকর্ড করা লাইভ সেশনগুলো যেকোনো সময়, যেকোনো জায়গা থেকে দেখুন।</p>
      </div>

      <div className="relative max-w-3xl mx-auto group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={24} />
        <input
          type="text"
          placeholder="টপিক বা বিবরণ দিয়ে ক্লাস খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/50 border border-white/10 rounded-[2rem] pl-16 pr-6 py-5 text-white focus:border-emerald-500 outline-none transition-all shadow-2xl backdrop-blur-xl font-bold"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredClasses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group bg-slate-900/50 border border-white/10 rounded-[3rem] overflow-hidden hover:border-emerald-500/30 transition-all shadow-2xl hover:shadow-emerald-500/5"
          >
            <div className="aspect-video relative bg-slate-800 overflow-hidden">
              <img src={`https://picsum.photos/seed/${c.id}/400/225`} alt={c.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-5 bg-emerald-500 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/40 scale-0 group-hover:scale-100 transition-transform duration-500 rotate-12 group-hover:rotate-0">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-2 bg-slate-950/80 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                  রেকর্ড করা
                </span>
              </div>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-fit">
                <Calendar size={14} className="text-emerald-500" /> {format(new Date(c.date), 'MMM dd, yyyy')}
              </div>
              <h3 className="text-2xl font-black text-white group-hover:text-emerald-500 transition-colors line-clamp-1 leading-tight">{c.title}</h3>
              <p className="text-slate-400 text-base leading-relaxed line-clamp-2 font-medium">{c.description}</p>
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <a href={c.videoLink} target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-black text-sm hover:underline flex items-center gap-3 group/link transition-all">
                  এখনই দেখুন <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                </a>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-black uppercase tracking-widest">
                  <Clock size={14} className="text-emerald-500" /> ৪৫ মিনিট
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredClasses.length === 0 && !loading && (
          <div className="col-span-full p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
            কোনো রেকর্ড করা ক্লাস পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
