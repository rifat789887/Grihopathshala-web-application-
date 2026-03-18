import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, doc, getDoc, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Calendar, Bell, PlayCircle, ArrowRight, ExternalLink, Smartphone, Monitor, Globe, Award, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const [marquee, setMarquee] = useState<{ text: string; link: string } | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Marquee
        try {
          const marqueeDoc = await getDoc(doc(db, 'settings', 'marquee'));
          if (marqueeDoc.exists()) setMarquee(marqueeDoc.data() as any);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, 'settings/marquee');
        }

        // Notices
        try {
          const noticesSnap = await getDocs(query(collection(db, 'notices'), where('active', '==', true), orderBy('date', 'desc'), limit(3)));
          setNotices(noticesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'notices');
        }

        // Routines
        try {
          const routinesSnap = await getDocs(query(collection(db, 'routines'), limit(7)));
          setRoutines(routinesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'routines');
        }

        // Classes
        try {
          const classesSnap = await getDocs(query(collection(db, 'classes'), orderBy('date', 'desc'), limit(5)));
          setClasses(classesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'classes');
        }

        // Courses
        try {
          const coursesSnap = await getDocs(query(collection(db, 'courses'), where('active', '==', true), limit(3)));
          setCourses(coursesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'courses');
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: '৬ষ্ঠ-৮ম শ্রেণী', icon: <GraduationCap size={32} />, color: 'bg-blue-500/10 text-blue-500' },
    { name: '৯ম-১০ম শ্রেণী', icon: <BookOpen size={32} />, color: 'bg-emerald-500/10 text-emerald-500' },
    { name: 'এসএসসি প্রস্তুতি', icon: <Award size={32} />, color: 'bg-amber-500/10 text-amber-500' },
    { name: 'এইচএসসি প্রস্তুতি', icon: <Users size={32} />, color: 'bg-purple-500/10 text-purple-500' },
  ];

  const apps = [
    { name: 'মেধা ১.০', url: 'https://medha.edtechbd.org/', desc: 'অনুশীলন ও প্রতিযোগিতা' },
    { name: 'মেধা ২.০', url: 'https://medha.grihopathshala.com/', desc: 'উন্নত অনুশীলন' },
    { name: 'গৃহপাঠশালা অ্যাপ', url: 'https://app.grihopathshala.com/', desc: 'অনলাইন কোচিং' },
    { name: 'এসএসসি গৃহপাঠশালা', url: 'https://ssc.grihopathshala.com/', desc: 'এসএসসি প্রস্তুতি' },
    { name: 'গৃহপাঠশালা স্টোর', url: 'https://store.grihopathshala.com/', desc: 'শিক্ষামূলক স্টোর' },
    { name: 'এডটেক স্টোর', url: 'https://store.edtechbd.org/', desc: 'টেক ও লার্নিং' },
    { name: 'ইংলিশ গুরু', url: 'https://eng.edtechbd.org/', desc: 'ইংরেজি শিখুন' },
  ];

  return (
    <div className="space-y-20">
      <Helmet>
        <title>গৃহপাঠশালা - আপনার অনলাইন শিক্ষা সঙ্গী | Home</title>
        <meta name="description" content="গৃহপাঠশালা (GrihoPathshala) - বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম। ৬ষ্ঠ থেকে এইচএসসি পর্যন্ত সকল বিষয়ের লাইভ ক্লাস, নোটস এবং রুটিন।" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "গৃহপাঠশালা",
              "url": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/",
              "logo": "https://lucide.dev/icons/graduation-cap.svg",
              "description": "বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম।",
              "sameAs": [
                "https://facebook.com/grihopathshala",
                "https://youtube.com/grihopathshala"
              ]
            }
          `}
        </script>
      </Helmet>
      {/* Marquee Advertisement */}
      {marquee && (
        <div className="bg-emerald-500/10 border-y border-emerald-500/20 py-3 overflow-hidden whitespace-nowrap">
          <motion.div
            animate={{ x: [1000, -2000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <a href={marquee.link} target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-bold text-sm tracking-wide hover:underline">
              {marquee.text} • {marquee.text} • {marquee.text} • {marquee.text}
            </a>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Tech Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full animate-pulse delay-700"></div>
        
        {/* Floating Tech Icons Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 left-10 text-emerald-500/20"
          >
            <Globe size={120} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-1/4 right-10 text-blue-500/20"
          >
            <Smartphone size={100} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 relative z-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/5">
              <Monitor size={18} className="animate-bounce" /> আধুনিক প্রযুক্তি নির্ভর শিক্ষা
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
              গৃহপাঠশালার সাথে আপনার <span className="text-emerald-500 italic relative inline-block">
                মেধা
                <motion.svg 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute -bottom-4 left-0 w-full text-emerald-500/30" viewBox="0 0 100 10" preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </motion.svg>
              </span> বিকাশ করুন
            </h1>
            <p className="text-slate-400 text-xl max-w-xl leading-relaxed font-medium">
              ৬ষ্ঠ থেকে ১২তম শ্রেণীর শিক্ষার্থীদের জন্য সেরা অনলাইন প্ল্যাটফর্ম। অভিজ্ঞ শিক্ষক, লাইভ ক্লাস এবং আধুনিক প্রযুক্তি নির্ভর পাঠদান।
            </p>
            <div className="flex flex-wrap gap-6 pt-6">
              <Link to="/admission" className="group relative bg-emerald-500 text-slate-950 px-10 py-5 rounded-3xl font-black text-lg hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 overflow-hidden active:scale-95">
                <span className="relative z-10">শুরু করুন</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
              <Link to="/courses" className="bg-white/5 text-white px-10 py-5 rounded-3xl font-black text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center gap-3 hover:gap-5 shadow-xl active:scale-95">
                কোর্সসমূহ দেখুন <ArrowRight size={22} />
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative"
          >
            {/* Tech Frame Decor */}
            <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full opacity-30 animate-pulse"></div>
            <div className="relative rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
              <img
                src="https://picsum.photos/seed/ict-learning/1000/800"
                alt="প্রযুক্তি শিক্ষা"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <Globe className="text-slate-950" size={32} />
                  </div>
                  <div>
                    <div className="text-white font-black text-xl">বিশ্বমানের শিক্ষা</div>
                    <div className="text-slate-400 font-bold">আপনার হাতের মুঠোয়</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden ${cat.color}`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {cat.icon}
            </div>
            <div className="mb-6 relative z-10">{cat.icon}</div>
            <h3 className="font-bold text-xl text-white relative z-10">{cat.name}</h3>
          </motion.div>
        ))}
      </section>

      {/* Weekly Routine & Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Weekly Routine */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Calendar size={120} />
          </div>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Calendar className="text-emerald-500" size={28} /> সাপ্তাহিক রুটিন
            </h2>
            <Link to="/routine" className="text-emerald-500 text-sm font-bold hover:underline flex items-center gap-1">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4 relative z-10">
            {routines.length > 0 ? routines.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-xs uppercase">
                    {r.day.substring(0, 3)}
                  </div>
                  <div>
                    <div className="text-white font-bold">{r.subject}</div>
                    <div className="text-xs text-slate-500">{r.teacher}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-500 font-mono text-sm font-bold">{r.time}</div>
                </div>
              </div>
            )) : <p className="text-slate-500 italic">এখনো কোনো রুটিন যোগ করা হয়নি।</p>}
          </div>
        </motion.section>

        {/* Notice Board */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Bell size={120} />
          </div>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bell className="text-emerald-500" size={28} /> নোটিশ বোর্ড
            </h2>
            <Link to="/notices" className="text-emerald-500 text-sm font-bold hover:underline flex items-center gap-1">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4 relative z-10">
            {notices.length > 0 ? notices.map((n, i) => (
              <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{format(new Date(n.date), 'MMM dd, yyyy')}</div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <h3 className="text-white font-bold mb-2 group-hover:text-emerald-500 transition-colors">{n.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-1 leading-relaxed">{n.content}</p>
              </div>
            )) : <p className="text-slate-500 italic">কোনো নোটিশ নেই।</p>}
          </div>
        </motion.section>
      </div>

      {/* Past Live Classes */}
      <section>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">পূর্ববর্তী লাইভ ক্লাস</h2>
            <p className="text-slate-500">মিস করা ক্লাসগুলো যেকোনো সময় দেখে নিন।</p>
          </div>
          <Link to="/classes" className="flex items-center gap-2 text-emerald-500 font-bold hover:gap-3 transition-all">
            সবগুলো দেখুন <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 border border-white/10 rounded-[2rem] overflow-hidden group shadow-xl"
            >
              <div className="aspect-video relative bg-slate-800 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/class-${c.id}/400/225`} 
                  alt={c.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                    <PlayCircle size={32} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10">
                    রেকর্ডেড
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="text-xs text-slate-500 mb-3 font-bold uppercase tracking-widest">{format(new Date(c.date), 'MMM dd, yyyy')}</div>
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-emerald-500 transition-colors">{c.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{c.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="relative overflow-hidden bg-emerald-500/5 border border-emerald-500/10 rounded-[3.5rem] p-12 md:p-20">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
          <BookOpen size={300} />
        </div>
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">জনপ্রিয় কোর্সসমূহ</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">আপনার পছন্দের কোর্সটি বেছে নিন এবং আজই আপনার শেখার যাত্রা শুরু করুন।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          {courses.map((course, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 hover:border-emerald-500/50 transition-all shadow-2xl"
            >
              <div className="aspect-square rounded-3xl bg-slate-900 mb-8 overflow-hidden border border-white/5">
                <img 
                  src={course.imageUrl || `https://picsum.photos/seed/course-${course.id}/300/300`} 
                  alt={course.title} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">{course.category}</div>
              <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{course.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{course.shortDescription || course.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">কোর্স ফি</span>
                  <span className="text-3xl font-black text-emerald-500 tracking-tighter">৳{course.price}</span>
                </div>
                <Link to="/courses" className="p-4 bg-emerald-500 text-slate-950 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                  <ArrowRight size={24} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* App Showcase */}
      <section>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">আমাদের ইকোসিস্টেম</h2>
          <p className="text-slate-500">শিক্ষার্থীদের জন্য আমাদের বিশেষায়িত অ্যাপ্লিকেশনসমূহ।</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app, i) => (
            <motion.a
              key={i}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-8 bg-slate-900/50 border border-white/10 rounded-[2rem] hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Smartphone size={80} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                  <Smartphone className="text-slate-400 group-hover:text-emerald-500" size={28} />
                </div>
                <ExternalLink size={18} className="text-slate-600 group-hover:text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">{app.name}</h3>
              <p className="text-slate-500 text-sm relative z-10 leading-relaxed">{app.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Admission CTA */}
      <section className="relative overflow-hidden bg-emerald-500 rounded-[4rem] p-12 md:p-24 text-center">
        {/* Animated Tech Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full border-[40px] border-slate-950 rounded-full"
          ></motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full border-[20px] border-slate-950 rounded-full"
          ></motion.div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black text-slate-950 leading-tight tracking-tighter">
            ভবিষ্যতের শিক্ষায় আপনি কি প্রস্তুত?
          </h2>
          <p className="text-slate-950/80 text-xl font-bold">
            নতুন সেশনের জন্য ভর্তি চলছে। আজই আপনার আসন নিশ্চিত করুন।
          </p>
          <Link to="/admission" className="group inline-flex items-center gap-3 bg-slate-950 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl">
            ভর্তি ফরম পূরণ করুন <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
