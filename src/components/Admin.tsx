import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Users, CreditCard, Bell, Calendar, BookOpen, FileText, GraduationCap, Settings, Plus, Trash2, Edit2, Check, X, Search, MoreVertical, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';

// Sub-components
import UserManagement from './admin/UserManagement';
import FeeManagement from './admin/FeeManagement';
import CourseManagement from './admin/CourseManagement';
import NoticeManagement from './admin/NoticeManagement';
import RoutineManagement from './admin/RoutineManagement';
import AdmissionManagement from './admin/AdmissionManagement';
import BlogManagement from './admin/BlogManagement';
import MarqueeManagement from './admin/MarqueeManagement';

export default function Admin() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminLinks = [
    { name: 'ড্যাশবোর্ড', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'ব্যবহারকারী', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'ভর্তি', path: '/admin/admissions', icon: <GraduationCap size={20} /> },
    { name: 'ফি', path: '/admin/fees', icon: <CreditCard size={20} /> },
    { name: 'কোর্স', path: '/admin/courses', icon: <BookOpen size={20} /> },
    { name: 'নোটিশ', path: '/admin/notices', icon: <Bell size={20} /> },
    { name: 'রুটিন', path: '/admin/routine', icon: <Calendar size={20} /> },
    { name: 'ব্লগ/নিউজ', path: '/admin/blog', icon: <FileText size={20} /> },
    { name: 'সেটিংস', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-[85vh] bg-slate-950 rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl backdrop-blur-3xl">
      {/* Admin Sidebar */}
      <aside className={`bg-slate-900/40 border-r border-white/5 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-12">
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]"
              >
                এডমিন প্যানেল
              </motion.span>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 transition-all hover:text-emerald-500 hover:scale-110 active:scale-90"
            >
              {isSidebarOpen ? <X size={20} /> : <MoreVertical size={20} />}
            </button>
          </div>
          <nav className="flex-1 space-y-3">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-5 p-4 rounded-2xl transition-all group relative ${
                  location.pathname === link.path 
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xl shadow-emerald-500/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`${location.pathname === link.path ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {link.icon}
                </div>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-bold tracking-wide"
                  >
                    {link.name}
                  </motion.span>
                )}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-3 w-1.5 h-1.5 bg-slate-950 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/admissions" element={<AdmissionManagement />} />
              <Route path="/fees" element={<FeeManagement />} />
              <Route path="/courses" element={<CourseManagement />} />
              <Route path="/notices" element={<NoticeManagement />} />
              <Route path="/routine" element={<RoutineManagement />} />
              <Route path="/blog" element={<BlogManagement />} />
              <Route path="/settings" element={<MarqueeManagement />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, admissions: 0, fees: 0, courses: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      const admissionsSnap = await getDocs(collection(db, 'admissions'));
      const feesSnap = await getDocs(collection(db, 'fees'));
      const coursesSnap = await getDocs(collection(db, 'courses'));
      setStats({
        users: usersSnap.size,
        admissions: admissionsSnap.size,
        fees: feesSnap.size,
        courses: coursesSnap.size
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: 'মোট ব্যবহারকারী', value: stats.users, icon: <Users size={28} />, color: 'bg-blue-500/10 text-blue-500', border: 'border-blue-500/20' },
    { name: 'ভর্তি আবেদন', value: stats.admissions, icon: <GraduationCap size={28} />, color: 'bg-emerald-500/10 text-emerald-500', border: 'border-emerald-500/20' },
    { name: 'ফি রেকর্ড', value: stats.fees, icon: <CreditCard size={28} />, color: 'bg-amber-500/10 text-amber-500', border: 'border-amber-500/20' },
    { name: 'কোর্স সংখ্যা', value: stats.courses, icon: <BookOpen size={28} />, color: 'bg-purple-500/10 text-purple-500', border: 'border-purple-500/20' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white leading-tight">ড্যাশবোর্ড ওভারভিউ</h1>
          <p className="text-slate-400 text-lg font-medium">স্বাগতম এডমিন। আজকের আপডেটগুলো দেখে নিন।</p>
        </div>
        <div className="text-right bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{format(new Date(), 'EEEE, MMMM dd')}</div>
          <div className="text-3xl font-black text-emerald-500">{format(new Date(), 'hh:mm a')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`p-8 bg-slate-900/50 border ${stat.border} rounded-[2.5rem] shadow-xl transition-all relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className={`p-4 rounded-2xl w-fit mb-6 shadow-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
            <div className="text-sm text-slate-500 font-black uppercase tracking-widest">{stat.name}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="p-10 bg-slate-900/50 border border-white/5 rounded-[3rem] shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" /> সাম্প্রতিক কার্যক্রম
          </h3>
          <div className="space-y-6">
            <div className="p-20 text-center border border-dashed border-white/10 rounded-[2rem] text-slate-500 italic font-medium">
              অ্যাক্টিভিটি লগ শীঘ্রই আসছে...
            </div>
          </div>
        </div>
        <div className="p-10 bg-slate-900/50 border border-white/5 rounded-[3rem] shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
            <div className="w-2 h-8 bg-blue-500 rounded-full" /> সিস্টেম হেলথ
          </h3>
          <div className="space-y-4">
            {[
              { label: 'ডাটাবেস কানেকশন', status: 'সক্রিয়', color: 'text-emerald-500' },
              { label: 'অথ সার্ভিস', status: 'সক্রিয়', color: 'text-emerald-500' },
              { label: 'স্টোরেজ সার্ভিস', status: 'সক্রিয়', color: 'text-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-6 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-slate-300 text-lg font-bold">{item.label}</span>
                <span className={`${item.color} text-xs font-black uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
