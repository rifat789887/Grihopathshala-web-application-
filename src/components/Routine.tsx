import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { Calendar, Clock, User as UserIcon, BookOpen, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Routine() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('শনিবার');

  useEffect(() => {
    const fetchRoutines = async () => {
      const q = query(collection(db, 'routines'), orderBy('day', 'asc'));
      const snap = await getDocs(q);
      setRoutines(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchRoutines();
  }, []);

  const days = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];

  const filteredRoutines = routines.filter(r => r.day === activeDay);

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <Helmet>
        <title>ক্লাস রুটিন | গৃহপাঠশালা - আপনার অনলাইন শিক্ষা সঙ্গী</title>
        <meta name="description" content="গৃহপাঠশালার সাপ্তাহিক ক্লাস রুটিন। আপনার ক্লাসের সময়সূচী এবং বিষয়গুলো এখান থেকে জেনে নিন।" />
      </Helmet>
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-white tracking-tight flex items-center justify-center gap-6">
          <Calendar className="text-emerald-500 animate-pulse" size={56} /> সাপ্তাহিক রুটিন
        </h1>
        <p className="text-slate-400 text-lg font-medium">আমাদের সুশৃঙ্খল ক্লাস শিডিউলের সাথে আপনার সপ্তাহের পরিকল্পনা করুন।</p>
      </div>

      {/* Day Selector */}
      <div className="flex flex-wrap justify-center gap-4 bg-slate-900/50 border border-white/10 p-6 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${
              activeDay === day ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRoutines.length > 0 ? (
          filteredRoutines.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-slate-900/50 border border-white/10 p-10 rounded-[3rem] hover:border-emerald-500/30 transition-all relative overflow-hidden shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/5">
                    <BookOpen size={28} />
                  </div>
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Clock size={14} className="text-emerald-500" /> {r.time}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-3 group-hover:text-emerald-500 transition-colors leading-tight">{r.subject}</h3>
                  <div className="flex items-center gap-3 text-slate-400 text-lg font-bold">
                    <UserIcon size={20} className="text-emerald-500/50" /> {r.teacher}
                  </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg">লাইভ ক্লাস</span>
                  <button className="p-3 bg-white/5 rounded-2xl text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all hover:scale-110 active:scale-90 border border-white/5 group-hover:border-emerald-500/20">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && (
            <div className="col-span-full p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
              {activeDay} কোনো ক্লাস নির্ধারিত নেই।
            </div>
          )
        )}
      </div>
    </div>
  );
}
