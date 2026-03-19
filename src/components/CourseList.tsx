import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Filter, ArrowRight, DollarSign, Tag, X, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function CourseList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, 'courses'), where('active', '==', true), orderBy('title', 'asc'));
      const snap = await getDocs(q);
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const categories = ['সব', '৬ষ্ঠ শ্রেণী', '৭ম শ্রেণী', '৮ম শ্রেণী', '৯ম শ্রেণী', '১০ম শ্রেণী', 'এসএসসি', '১১শ শ্রেণী', '১২শ শ্রেণী', 'এইচএসসি', 'দক্ষতা উন্নয়ন'];

  const filteredCourses = courses.filter(c => 
    (selectedCategory === 'সব' || c.category === selectedCategory) &&
    (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (c.shortDescription && c.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (c.detailedDescription && c.detailedDescription.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-16">
      <Helmet>
        <title>আমাদের কোর্সসমূহ | গৃহপাঠশালা - আপনার অনলাইন শিক্ষা সঙ্গী | Our Courses - GrihoPathshala</title>
        <meta name="description" content="গৃহপাঠশালার সকল কোর্সের তালিকা। ৬ষ্ঠ থেকে এইচএসসি এবং দক্ষতা উন্নয়নমূলক বিভিন্ন কোর্সে ভর্তি হয়ে আপনার পড়াশোনাকে আরও সহজ করুন। Explore our wide range of courses from Class 6 to HSC." />
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
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "Courses",
                "item": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/courses"
              }]
            }
          `}
        </script>
        {courses.length > 0 && (
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": ${JSON.stringify(courses.map((c, i) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "item": {
                    "@type": "Course",
                    "name": c.title,
                    "description": c.shortDescription || c.description,
                    "provider": {
                      "@type": "Organization",
                      "name": "GrihoPathshala",
                      "sameAs": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/"
                    }
                  }
                })))}
              }
            `}
          </script>
        )}
      </Helmet>
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-xs font-black uppercase tracking-[0.3em] mb-4"
        >
          আমাদের কোর্সসমূহ
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
          আপনার ভবিষ্যৎ <span className="text-emerald-500">গড়ুন</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          আপনার একাডেমিক যাত্রায় শ্রেষ্ঠত্ব অর্জনে সহায়তা করার জন্য ডিজাইন করা আমাদের বিস্তৃত কোর্সগুলো অন্বেষণ করুন।
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between bg-slate-900/50 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
        <div className="relative w-full lg:w-[400px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={22} />
          <input
            type="text"
            placeholder="কোর্স খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-emerald-500 outline-none transition-all shadow-inner font-bold"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto w-full lg:w-auto pb-3 lg:pb-0 no-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -10 }}
            onClick={() => setSelectedCourse(course)}
            className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/40 transition-all shadow-2xl relative cursor-pointer"
          >
            <div className="aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-slate-950 px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  বিস্তারিত দেখুন <Info size={18} />
                </span>
              </div>
              <div className="w-full h-full bg-slate-900/50 flex items-center justify-center p-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-1000" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <BookOpen size={40} className="text-emerald-500" />
                  </div>
                )}
              </div>
              <div className="absolute top-5 left-5 z-20">
                <span className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                  {course.category}
                </span>
              </div>
            </div>
            <div className="p-10 space-y-6">
              <h3 className="text-2xl font-black text-white group-hover:text-emerald-500 transition-colors leading-tight">{course.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium">{course.shortDescription || course.description}</p>
              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">কোর্স ফি</span>
                  <span className="text-3xl font-black text-emerald-500 tracking-tighter">৳{course.price}</span>
                </div>
                <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                  <ArrowRight size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredCourses.length === 0 && !loading && (
          <div className="col-span-full p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
            আপনার অনুসন্ধানের সাথে মিলছে এমন কোনো কোর্স পাওয়া যায়নি।
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-8 right-8 z-50 p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all"
              >
                <X size={24} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden">
                <div className="relative h-64 lg:h-full bg-slate-950/50 flex items-center justify-center p-12 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-30"></div>
                  {selectedCourse.imageUrl ? (
                    <img 
                      src={selectedCourse.imageUrl} 
                      alt={selectedCourse.title} 
                      className="w-full h-full object-cover rounded-3xl relative z-10 shadow-2xl"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 relative z-10">
                      <BookOpen size={64} className="text-emerald-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r"></div>
                </div>

                <div className="p-8 md:p-16 space-y-10 overflow-y-auto">
                  <div className="space-y-4">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      {selectedCourse.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{selectedCourse.title}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-emerald-500">
                      <Sparkles size={24} />
                      <h4 className="text-lg font-black uppercase tracking-widest">কোর্সের বিশেষত্ব</h4>
                    </div>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5 italic">
                      "{selectedCourse.speciality || 'এই কোর্সটি আপনাকে আপনার লক্ষ্যে পৌঁছাতে সাহায্য করবে।'}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">বিস্তারিত বর্ণনা</h4>
                    <p className="text-slate-400 leading-relaxed font-medium">
                      {selectedCourse.detailedDescription || selectedCourse.description}
                    </p>
                  </div>

                  {selectedCourse.features && selectedCourse.features.length > 0 && (
                    <div className="space-y-6">
                      <h4 className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">আপনি যা যা পাবেন</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCourse.features.map((feature: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-slate-300">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <span className="font-bold">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
                    <div className="text-center sm:text-left">
                      <span className="text-xs text-slate-500 font-black uppercase tracking-widest block mb-2">কোর্স ফি</span>
                      <span className="text-5xl font-black text-emerald-500 tracking-tighter">৳{selectedCourse.price}</span>
                    </div>
                    <button className="w-full sm:w-auto bg-emerald-500 text-slate-950 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-4 active:scale-95 group">
                      ভর্তি হোন <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
