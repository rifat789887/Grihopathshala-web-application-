import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, doc, getDoc, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Calendar, Bell, PlayCircle, ArrowRight, ExternalLink, Smartphone, Monitor, Globe, Award, Users, Youtube, Facebook, MessageCircle, Send, MessageSquare } from 'lucide-react';
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
        <title>গৃহপাঠশালা - আপনার অনলাইন শিক্ষা সঙ্গী | GrihoPathshala - Your Online Education Partner</title>
        <meta name="description" content="গৃহপাঠশালা (GrihoPathshala) - বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম। ৬ষ্ঠ থেকে এইচএসসি পর্যন্ত সকল বিষয়ের লাইভ ক্লাস, নোটস এবং রুটিন। GrihoPathshala is the best online education platform in Bangladesh for Class 6 to HSC." />
        <meta name="keywords" content="গৃহপাঠশালা, GrihoPathshala, অনলাইন শিক্ষা, বাংলাদেশ, লাইভ ক্লাস, নোটস, রুটিন, এসএসসি, এইচএসসি, শিক্ষা অ্যাপ, Online Education Bangladesh, Live Classes, HSC Notes, SSC Routine, EdTech Bangladesh, Best Online School" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "গৃহপাঠশালা (GrihoPathshala)",
              "url": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/",
              "logo": "https://lucide.dev/icons/graduation-cap.svg",
              "description": "বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম। The leading online education platform in Bangladesh.",
              "sameAs": [
                "https://facebook.com/grihopathshala",
                "https://youtube.com/grihopathshala"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+880123456789",
                "contactType": "customer service"
              }
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "গৃহপাঠশালা কী?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "গৃহপাঠশালা একটি অনলাইন শিক্ষা প্ল্যাটফর্ম যা বাংলাদেশের ৬ষ্ঠ থেকে এইচএসসি শিক্ষার্থীদের জন্য লাইভ ক্লাস, নোটস এবং রুটিন প্রদান করে।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "কিভাবে ভর্তি হব?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "আপনি আমাদের ওয়েবসাইটের 'ভর্তি' সেকশনে গিয়ে অনলাইন ফর্ম পূরণ করে সহজেই ভর্তি হতে পারেন।"
                  }
                },
                {
                  "@type": "Question",
                  "name": "লাইভ ক্লাস কি রেকর্ড করা থাকে?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "হ্যাঁ, আমাদের প্রতিটি লাইভ ক্লাস রেকর্ড করা থাকে যাতে শিক্ষার্থীরা পরবর্তীতে যেকোনো সময় তা দেখে নিতে পারে।"
                  }
                }
              ]
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/"
              }]
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
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.03)_1px,_transparent_1px)] bg-[size:40px_40px]"></div>
        
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
          
          {/* New Floating Education Elements */}
          <motion.div 
            animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] text-amber-500/10"
          >
            <BookOpen size={80} />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-[20%] text-purple-500/10"
          >
            <Award size={150} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/5">
              <Monitor size={18} className="animate-bounce" /> আধুনিক প্রযুক্তি নির্ভর শিক্ষা
            </div>
            <h1 className="text-5xl md:text-[80px] font-black text-white leading-[1.1] tracking-tighter">
              গৃহপাঠশালায় তোমার শেখা হোক আরো <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 animate-gradient-x relative inline-block">
                আনন্দময়
              </span> ও <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 animate-gradient-x">আকর্ষণীয় !</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-xl leading-relaxed font-medium">
              ৬ষ্ঠ থেকে ১২তম শ্রেণীর শিক্ষার্থীদের জন্য সেরা অনলাইন প্ল্যাটফর্ম। অভিজ্ঞ শিক্ষক, লাইভ ক্লাস এবং আধুনিক প্রযুক্তি নির্ভর পাঠদান।
            </p>
            <div className="flex flex-wrap gap-6 pt-6 justify-center lg:justify-start">
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
            <div className="relative rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden group bg-slate-900/50 backdrop-blur-3xl aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
              
              {/* Professional Icon Composition instead of Illustration */}
              <div className="relative z-20 flex flex-col items-center gap-8">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                >
                  <GraduationCap size={100} className="text-emerald-500" />
                </motion.div>
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <BookOpen size={32} className="text-blue-500" />
                  </div>
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                    <Award size={32} className="text-amber-500" />
                  </div>
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                    <Users size={32} className="text-purple-500" />
                  </div>
                </div>
              </div>

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

      {/* Features Showcase Section */}
      <section className="space-y-20 py-10 relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10"></div>

        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 font-black text-sm uppercase tracking-widest"
          >
            গৃহ পাঠশালা - ঘরে ঘরে স্মার্ট পাঠশালা
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            এক পাঠশালায় <span className="text-emerald-500">সবকিছু !</span>
          </h2>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg font-medium">
            লক্ষাধিক শিক্ষার্থীর আস্থা এবং সাফল্যের বিশ্বস্ত সঙ্গী। একাডেমিক কিংবা এডমিশন, চাকরি কিংবা স্কিলস্ - জীবনের প্রতিটি ক্ষেত্রে আমরা আছি আপনার পাশে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Online Classes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-2xl"
          >
            {/* Card Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 border border-emerald-500/30">
                  <PlayCircle size={32} />
                </div>
                <h3 className="text-3xl font-black text-white">অনলাইন ক্লাস</h3>
                <ul className="space-y-4">
                  {[
                    'ক্লিয়ার ভয়েস ও রেকর্ডিং এর সাথে সহজ বোধগম্য গুনগত মান সম্পন্ন অনলাইন ক্লাস',
                    'সরাসরি প্রশ্ন উত্তর পর্ব',
                    'প্রতিটি বিষয়ে, প্রতিটি অধ্যায়ের, প্রতিটি টপিক ভিত্তিক রেকর্ডেড ক্লাস',
                    'ভিজুয়ালাইজড ও প্রাকটিক্যাল লেসনস্ ভিডিও'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium leading-relaxed">
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-56 aspect-square relative flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-40 h-40 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl group-hover:bg-emerald-500/20 transition-colors"
                >
                  <PlayCircle size={80} className="text-emerald-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Digital Books */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden hover:border-blue-500/50 transition-all shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -z-10 group-hover:bg-blue-500/10 transition-colors"></div>

            <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-500/30">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-3xl font-black text-white">ডিজিটাল বই</h3>
                <ul className="space-y-4">
                  {[
                    'সকল শ্রেণীর, সকল বিষয়ের পাঠ্যপুস্তক একাডেমিক বই',
                    'নোট ও গাইড বইয়ের সমাহার',
                    'ক্লিয়ার প্রিন্টেড ডিজিটাল নোটস্'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium leading-relaxed">
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-56 aspect-square relative flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="w-40 h-40 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-2xl group-hover:bg-blue-500/20 transition-colors"
                >
                  <BookOpen size={80} className="text-blue-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Online Exams */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden hover:border-amber-500/50 transition-all shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full -z-10 group-hover:bg-amber-500/10 transition-colors"></div>

            <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 border border-amber-500/30">
                  <Award size={32} />
                </div>
                <h3 className="text-3xl font-black text-white">অনলাইন পরীক্ষা</h3>
                <ul className="space-y-4">
                  {[
                    'প্রতিটি বিষয়ের, প্রতিটি অধ্যায়ের টপিক ভিত্তিক পরীক্ষা',
                    'বিভিন্ন স্ট্যান্ডার্ড এর (একাডেমিক, এইচএসসি, মেডিকেল, ইন্জিনিয়ারিং, ভার্সিটি) প্রশ্ন পরীক্ষা',
                    'প্রশ্ন ব্যাংক এর উপর পরীক্ষা'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium leading-relaxed">
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-56 aspect-square relative flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="w-40 h-40 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center border border-amber-500/20 shadow-2xl group-hover:bg-amber-500/20 transition-colors"
                >
                  <Award size={80} className="text-amber-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Other Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 overflow-hidden hover:border-purple-500/50 transition-all shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full -z-10 group-hover:bg-purple-500/10 transition-colors"></div>

            <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/20 border border-purple-500/30">
                  <MessageCircle size={32} />
                </div>
                <h3 className="text-3xl font-black text-white">অন্যান্য সাপোর্ট</h3>
                <ul className="space-y-4">
                  {[
                    'নিশ্চিত সাফল্যের গাইডলাইন সাপোর্ট',
                    '২৪×৭ সার্বক্ষণিক সাপোর্ট',
                    'মানসিক স্বাস্থ্য সাপোর্ট'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 font-medium leading-relaxed">
                      <div className="mt-1.5 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-56 aspect-square relative flex items-center justify-center">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="w-40 h-40 bg-purple-500/10 rounded-[2.5rem] flex items-center justify-center border border-purple-500/20 shadow-2xl group-hover:bg-purple-500/20 transition-colors"
                >
                  <MessageCircle size={80} className="text-purple-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10"
        >
          {[
            { label: 'শিক্ষার্থী', value: '১০,০০০+', icon: <Users size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'ভিডিও ক্লাস', value: '৫০০+', icon: <PlayCircle size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'ডিজিটাল বই', icon: <BookOpen size={24} />, value: '১০০+', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'অনলাইন পরীক্ষা', icon: <Award size={24} />, value: '৫০+', color: 'text-purple-500', bg: 'bg-purple-500/10' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4 p-8 rounded-[2rem] bg-slate-900/30 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="text-slate-500 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="relative z-10 space-y-8">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
              সকল বিষয়ের সকল অধ্যায় <br /> এর অন্তর্ভুক্ত !
            </h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {[
                { label: 'টপিক ভিত্তিক ভিডিও ক্লাস', icon: <PlayCircle size={20} /> },
                { label: 'টপিক ভিত্তিক নোটস্', icon: <BookOpen size={20} /> },
                { label: 'টপিক ভিত্তিক কুইজ প্রাকটিস', icon: <Award size={20} /> },
                { label: 'টপিক ভিত্তিক পরীক্ষা', icon: <Calendar size={20} /> },
                { label: 'লাইভ সাপোর্ট', icon: <MessageCircle size={20} /> }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl font-black text-sm border border-white/20 shadow-xl"
                >
                  <span className="text-emerald-300">{item.icon}</span> {item.label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
        <div className="absolute -inset-10 bg-blue-500/5 blur-[100px] rounded-full -z-10"></div>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className={`p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden ${cat.color} shadow-xl`}
          >
            {/* Decorative Card Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.05)_0%,_transparent_50%)]"></div>
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-20 transition-all duration-500 scale-150 rotate-12">
              {cat.icon}
            </div>
            
            <div className="mb-6 relative z-10 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 transition-colors">
              {cat.icon}
            </div>
            <h3 className="font-black text-xl text-white relative z-10 tracking-tight">{cat.name}</h3>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              বিস্তারিত দেখুন <ArrowRight size={14} />
            </div>
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
              <div className="aspect-video relative bg-slate-800/50 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-50"></div>
                <div className="relative z-10 w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md group-hover:scale-110 transition-transform duration-700">
                  <PlayCircle size={48} className="text-emerald-500" />
                </div>
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
              <div className="aspect-square rounded-3xl bg-slate-900/50 mb-8 overflow-hidden border border-white/5 flex items-center justify-center p-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <BookOpen size={48} className="text-emerald-500" />
                  </div>
                )}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {apps.map((app, i) => (
            <motion.a
              key={i}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.02 }}
              className="aspect-square p-4 md:p-8 bg-slate-900/50 border border-white/10 rounded-[2rem] hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center"
            >
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Smartphone size={80} />
              </div>
              <div className="mb-4 relative z-10">
                <div className="p-3 md:p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                  <Smartphone className="text-slate-400 group-hover:text-emerald-500" size={24} />
                </div>
              </div>
              <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2 relative z-10">{app.name}</h3>
              <p className="text-slate-500 text-[10px] md:text-sm relative z-10 leading-tight md:leading-relaxed line-clamp-2">{app.desc}</p>
              <ExternalLink size={14} className="absolute top-4 right-4 text-slate-600 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* Social Media Showcase */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full"></div>
        
        <div className="text-center mb-16 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter"
          >
            আমাদের সাথে <span className="text-emerald-500">যুক্ত হোন</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            সোশ্যাল মিডিয়ায় আমাদের ফলো করুন এবং নিয়মিত আপডেট, টিপস ও ট্রিকস পান।
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6 relative z-10">
          {/* YouTube Card */}
          <motion.a
            href="https://www.youtube.com/@GrihoPathshala"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 overflow-hidden transition-all hover:border-red-500/50 shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 text-red-500/5 group-hover:text-red-500/10 transition-colors">
              <Youtube size={300} />
            </div>
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10 group-hover:scale-110 transition-transform duration-500">
                  <Youtube size={40} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">ইউটিউব চ্যানেল</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    ভিডিও টিউটোরিয়াল, লাইভ ক্লাস এবং শিক্ষামূলক কন্টেন্ট দেখতে আমাদের চ্যানেলটি সাবস্ক্রাইব করুন।
                  </p>
                </div>
              </div>
              
              <div className="mt-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user-${i}`} alt="subscriber" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-500 text-sm font-bold">৫০কে+ সাবস্ক্রাইবার</span>
                </div>
                <div className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all shadow-lg shadow-red-500/20">
                  সাবস্ক্রাইব <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </motion.a>

          {/* Facebook Card */}
          <motion.a
            href="https://www.facebook.com/GrihoPathshala"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 overflow-hidden transition-all hover:border-blue-500/50 shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 text-blue-500/5 group-hover:text-blue-500/10 transition-colors">
              <Facebook size={300} />
            </div>
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                  <Facebook size={40} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">ফেসবুক পেজ</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    প্রতিদিনের আপডেট, কুইজ এবং আমাদের কমিউনিটির সাথে যুক্ত থাকতে আমাদের পেজটি লাইক দিন।
                  </p>
                </div>
              </div>
              
              <div className="mt-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[4,5,6].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user-${i}`} alt="follower" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-500 text-sm font-bold">১০০কে+ ফলোয়ার</span>
                </div>
                <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all shadow-lg shadow-blue-600/20">
                  লাইক দিন <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </motion.a>
        </div>
      </section>

      {/* Contact & Community Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">সরাসরি যোগাযোগ ও কমিউনিটি</h2>
          <p className="text-slate-500">যেকোনো প্রয়োজনে আমাদের সাথে সরাসরি যোগাযোগ করুন অথবা আমাদের কমিউনিটিতে যুক্ত হোন।</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Direct Contact */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 space-y-8"
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="text-emerald-500" /> সরাসরি যোগাযোগ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="https://wa.me/8801300424328" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-3xl hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all group">
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                </div>
                <span className="text-white font-bold text-sm">হোয়াটসঅ্যাপ</span>
              </a>
              <a href="https://m.me/Grihopathshala" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-3xl hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                  <Facebook size={28} />
                </div>
                <span className="text-white font-bold text-sm">মেসেঞ্জার</span>
              </a>
              <a href="https://t.me/GrihopathshalaAdmin" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-3xl hover:bg-sky-500/10 border border-white/5 hover:border-sky-500/30 transition-all group">
                <div className="p-4 bg-sky-500/10 rounded-2xl text-sky-500 group-hover:scale-110 transition-transform">
                  <Send size={28} />
                </div>
                <span className="text-white font-bold text-sm">টেলিগ্রাম</span>
              </a>
            </div>
          </motion.div>

          {/* Our Community */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 space-y-8"
          >
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="text-emerald-500" /> আমাদের কমিউনিটি
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="https://facebook.com/groups/grihopathshala/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-3xl hover:bg-blue-600/10 border border-white/5 hover:border-blue-600/30 transition-all group">
                <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <span className="text-white font-bold text-sm">ফেসবুক গ্রুপ</span>
              </a>
              <a href="https://chat.whatsapp.com/KIQHgovAq78IIsBT3cBY9k" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-3xl hover:bg-emerald-600/10 border border-white/5 hover:border-emerald-600/30 transition-all group">
                <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                </div>
                <span className="text-white font-bold text-sm">হোয়াটসঅ্যাপ</span>
              </a>
              <a href="https://t.me/Grihopathshala" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-4 p-6 bg-white/5 rounded-3xl hover:bg-sky-600/10 border border-white/5 hover:border-sky-600/30 transition-all group">
                <div className="p-4 bg-sky-600/10 rounded-2xl text-sky-600 group-hover:scale-110 transition-transform">
                  <Send size={28} />
                </div>
                <span className="text-white font-bold text-sm">টেলিগ্রাম</span>
              </a>
            </div>
          </motion.div>
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
