import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, Trash2, Edit2, Check, X, Search, Image as ImageIcon, DollarSign, Tag, FileText } from 'lucide-react';

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    price: 0,
    category: 'ষষ্ঠ শ্রেণী',
    imageUrl: '',
    features: '',
    speciality: '',
    active: true,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, 'courses'), orderBy('title', 'asc'));
      const snap = await getDocs(q);
      setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
    };

    if (editingCourse) {
      await updateDoc(doc(db, 'courses', editingCourse.id), dataToSave);
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...dataToSave } : c));
    } else {
      const docRef = await addDoc(collection(db, 'courses'), dataToSave);
      setCourses([...courses, { id: docRef.id, ...dataToSave }]);
    }
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({ title: '', shortDescription: '', detailedDescription: '', price: 0, category: 'ষষ্ঠ শ্রেণী', imageUrl: '', features: '', speciality: '', active: true });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে আপনি এই কোর্সটি মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${id}`);
    }
  };

  const categories = ['ষষ্ঠ শ্রেণী', 'সপ্তম শ্রেণী', 'অষ্টম শ্রেণী', 'নবম শ্রেণী', 'দশম শ্রেণী', 'এসএসসি', 'একাদশ শ্রেণী', 'দ্বাদশ শ্রেণী', 'এইচএসসি', 'দক্ষতা উন্নয়ন'];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-4">
          <BookOpen className="text-emerald-500" size={32} /> কোর্স ব্যবস্থাপনা
        </h2>
        <button
          onClick={() => { 
            setEditingCourse(null); 
            setFormData({ title: '', shortDescription: '', detailedDescription: '', price: 0, category: 'ষষ্ঠ শ্রেণী', imageUrl: '', features: '', speciality: '', active: true }); 
            setIsModalOpen(true); 
          }}
          className="bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20"
        >
          <Plus size={20} /> নতুন কোর্স যোগ করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-emerald-500/5 backdrop-blur-3xl"
          >
            <div className="aspect-video relative bg-slate-800 overflow-hidden">
              <img 
                src={course.imageUrl || `https://picsum.photos/seed/${course.id}/400/225`} 
                alt={course.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => { 
                    setEditingCourse(course); 
                    setFormData({ 
                      ...course, 
                      features: Array.isArray(course.features) ? course.features.join(', ') : (course.features || '') 
                    }); 
                    setIsModalOpen(true); 
                  }}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-emerald-500 hover:text-slate-950 transition-all border border-white/10"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all border border-white/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-8 space-y-5">
              <div className="flex justify-between items-start">
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  {course.category}
                </span>
                <span className="text-2xl font-black text-emerald-500">৳{course.price}</span>
              </div>
              <h3 className="text-white font-black text-xl line-clamp-1 group-hover:text-emerald-500 transition-colors">{course.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 font-medium leading-relaxed">{course.shortDescription || course.description}</p>
              <div className="flex items-center gap-3 pt-2">
                <div className={`w-2.5 h-2.5 rounded-full ${course.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{course.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-3xl shadow-2xl overflow-y-auto max-h-[90vh] relative"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white">{editingCourse ? 'কোর্স সম্পাদনা' : 'নতুন কোর্স যোগ করুন'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><X size={28} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><BookOpen size={14} className="text-emerald-500" /> কোর্সের শিরোনাম</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Tag size={14} className="text-emerald-500" /> ক্যাটাগরি</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold appearance-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><DollarSign size={14} className="text-emerald-500" /> মূল্য (৳)</label>
                    <input
                      required
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} className="text-emerald-500" /> ইমেজ ইউআরএল</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all font-bold"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-emerald-500" /> সংক্ষিপ্ত বর্ণনা</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none resize-none transition-all font-medium leading-relaxed"
                    placeholder="কোর্সের একটি ছোট সারসংক্ষেপ..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FileText size={14} className="text-emerald-500" /> বিস্তারিত বর্ণনা</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none resize-none transition-all font-medium leading-relaxed"
                    placeholder="কোর্সের বিস্তারিত তথ্য..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Plus size={14} className="text-emerald-500" /> কোর্সের বৈশিষ্ট্যসমূহ (কমা দিয়ে আলাদা করুন)</label>
                    <textarea
                      rows={3}
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none resize-none transition-all font-medium leading-relaxed"
                      placeholder="লাইভ ক্লাস, পিডিএফ নোটস, কুইজ..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Check size={14} className="text-emerald-500" /> কোর্সের বিশেষত্ব</label>
                    <textarea
                      rows={3}
                      value={formData.speciality}
                      onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none resize-none transition-all font-medium leading-relaxed"
                      placeholder="এই কোর্সটি কেন সেরা?"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-6 h-6 rounded-lg bg-slate-950 border-white/10 text-emerald-500 focus:ring-emerald-500 transition-all cursor-pointer"
                  />
                  <label htmlFor="active" className="text-sm text-slate-300 font-black uppercase tracking-widest cursor-pointer">সক্রিয় (হোমপেজে প্রদর্শিত হবে)</label>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-slate-950 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20">
                  {editingCourse ? 'কোর্স আপডেট করুন' : 'কোর্স তৈরি করুন'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
