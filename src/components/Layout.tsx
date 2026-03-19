import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Menu, X, LogOut, User as UserIcon, Settings, Bell, BookOpen, Calendar, PlayCircle, Youtube, Facebook, MessageCircle, Send, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  role: string | null;
}

export default function Layout({ children, user, role }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'হোম', path: '/', icon: <GraduationCap size={18} /> },
    { name: 'কোর্সসমূহ', path: '/courses', icon: <BookOpen size={18} /> },
    { name: 'নোটিশ', path: '/notices', icon: <Bell size={18} /> },
    { name: 'রুটিন', path: '/routine', icon: <Calendar size={18} /> },
    { name: 'ক্লাস', path: '/classes', icon: <PlayCircle size={18} /> },
    { name: 'ব্লগ', path: '/blog', icon: <BookOpen size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">
      {/* Global Tech Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50"></div>
      </div>

      {/* Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="p-2.5 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-500/5"
              >
                <GraduationCap className="text-emerald-500" size={28} />
              </motion.div>
              <span className="text-2xl font-black tracking-tighter text-white">
                গৃহ<span className="text-emerald-500">পাঠশালা</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-bold text-slate-400 hover:text-emerald-500 transition-all relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
                </Link>
              ))}
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-black text-emerald-500 hover:text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/20 transition-all hover:bg-emerald-500/10"
                >
                  <Settings size={16} /> এডমিন
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-5 border-l border-white/10 pl-8">
                  <Link to="/admission" className="text-sm font-black bg-emerald-500 text-slate-950 px-6 py-2.5 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    ভর্তি ফরম
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    title="লগআউট"
                  >
                    <LogOut size={22} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="text-sm font-black bg-white/5 hover:bg-white/10 text-white px-7 py-2.5 rounded-2xl transition-all border border-white/10 shadow-xl hover:border-white/20"
                >
                  লগইন
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 text-slate-400 hover:text-white bg-white/5 rounded-2xl border border-white/5 transition-all active:scale-90"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-slate-950 pt-20 px-4"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-slate-300 p-3 rounded-xl hover:bg-white/5"
                >
                  {link.icon} {link.name}
                </Link>
              ))}
              {role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-emerald-500 p-3 rounded-xl hover:bg-emerald-500/5"
                >
                  <Settings size={18} /> এডমিন ড্যাশবোর্ড
                </Link>
              )}
              <div className="mt-4 pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <Link
                      to="/admission"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold mb-3"
                    >
                      ভর্তি ফরম
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full bg-white/5 text-white py-3 rounded-xl font-medium border border-white/10"
                    >
                      <LogOut size={18} /> লগআউট
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold"
                  >
                    লগইন
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <GraduationCap className="text-emerald-500" size={24} />
                <span className="text-xl font-bold text-white">গৃহপাঠশালা</span>
              </Link>
              <p className="text-slate-400 max-w-md leading-relaxed mb-6">
                একটি আধুনিক প্রযুক্তি নির্ভর শিক্ষা প্ল্যাটফর্ম যা ৬ষ্ঠ থেকে ১২তম শ্রেণীর শিক্ষার্থীদের জন্য মানসম্মত শিক্ষা নিশ্চিত করে।
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.youtube.com/@GrihoPathshala" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all" title="YouTube">
                  <Youtube size={20} />
                </a>
                <a href="https://www.facebook.com/GrihoPathshala" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all" title="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://wa.me/8801300424328" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all" title="WhatsApp">
                  <MessageCircle size={20} />
                </a>
                <a href="https://t.me/Grihopathshala" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-500/10 transition-all" title="Telegram">
                  <Send size={20} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">দ্রুত লিঙ্ক</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/courses" className="hover:text-emerald-500">কোর্সসমূহ</Link></li>
                <li><Link to="/notices" className="hover:text-emerald-500">নোটিশ বোর্ড</Link></li>
                <li><Link to="/routine" className="hover:text-emerald-500">সাপ্তাহিক রুটিন</Link></li>
                <li><Link to="/classes" className="hover:text-emerald-500">লাইভ ক্লাস</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">কমিউনিটি</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://facebook.com/groups/grihopathshala/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">ফেসবুক গ্রুপ</a></li>
                <li><a href="https://chat.whatsapp.com/KIQHgovAq78IIsBT3cBY9k" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">হোয়াটসঅ্যাপ গ্রুপ</a></li>
                <li><a href="https://t.me/Grihopathshala" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">টেলিগ্রাম চ্যানেল</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">যোগাযোগ</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://m.me/Grihopathshala" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">ফেসবুক মেসেঞ্জার</a></li>
                <li><a href="https://wa.me/8801300424328" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">হোয়াটসঅ্যাপ: +৮৮০ ১৩০০ ৪২৪৩২৮</a></li>
                <li>ইমেইল: info@grihopathshala.com</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} গৃহপাঠশালা। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>
    </div>
  );
}
