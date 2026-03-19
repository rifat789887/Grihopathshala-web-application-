import { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, CheckCircle, Clock, AlertCircle, Send, User as UserIcon, School, MapPin, Users, BookOpen, Download, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface AdmissionFormProps {
  user: User;
}

export default function AdmissionForm({ user }: AdmissionFormProps) {
  const [formData, setFormData] = useState({
    studentName: user.displayName || '',
    fatherName: '',
    motherName: '',
    schoolName: '',
    studentClass: '৬ষ্ঠ শ্রেণী',
    district: '',
    courseId: '',
    courseTitle: '',
    mobileNumber: '',
    whatsappNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myAdmissions, setMyAdmissions] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyAdmissions = async () => {
      try {
        const q = query(collection(db, 'admissions'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setMyAdmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'admissions');
      }
    };
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, 'courses'), where('active', '==', true), orderBy('title', 'asc'));
        const snap = await getDocs(q);
        setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'courses');
      }
    };
    fetchMyAdmissions();
    fetchCourses();
  }, [user.uid, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId) {
      setError('অনুগ্রহ করে একটি কোর্স নির্বাচন করুন।');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, 'admissions'), {
        ...formData,
        userId: user.uid,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setFormData({
        studentName: user.displayName || '',
        fatherName: '',
        motherName: '',
        schoolName: '',
        studentClass: '৬ষ্ঠ শ্রেণী',
        district: '',
        courseId: '',
        courseTitle: '',
        mobileNumber: '',
        whatsappNumber: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'admissions');
      setError('আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (adm: any) => {
    const printContent = `
      <html>
        <head>
          <title>ভর্তি রশিদ - গৃহপাঠশালা</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #10b981; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { margin-bottom: 15px; }
            .label { font-weight: bold; color: #666; font-size: 14px; }
            .value { font-size: 16px; margin-top: 5px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; pt: 20px; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 12px; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-approved { background: #d1fae5; color: #065f46; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">গৃহপাঠশালা - ভর্তি রশিদ</div>
            <p>অনলাইন শিক্ষা প্ল্যাটফর্ম</p>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">শিক্ষার্থীর নাম</div>
              <div class="value">${adm.studentName}</div>
            </div>
            <div class="info-item">
              <div class="label">কোর্স</div>
              <div class="value">${adm.courseTitle}</div>
            </div>
            <div class="info-item">
              <div class="label">শ্রেণী</div>
              <div class="value">${adm.studentClass}</div>
            </div>
            <div class="info-item">
              <div class="label">পিতার নাম</div>
              <div class="value">${adm.fatherName}</div>
            </div>
            <div class="info-item">
              <div class="label">মোবাইল নম্বর</div>
              <div class="value">${adm.mobileNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">হোয়াটসঅ্যাপ নম্বর</div>
              <div class="value">${adm.whatsappNumber}</div>
            </div>
            <div class="info-item">
              <div class="label">আবেদনের তারিখ</div>
              <div class="value">${format(new Date(adm.createdAt), 'dd MMMM, yyyy')}</div>
            </div>
            <div class="info-item">
              <div class="label">অবস্থা</div>
              <div class="value">
                <span class="status ${adm.status === 'approved' ? 'status-approved' : 'status-pending'}">
                  ${adm.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমান'}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="label">পেমেন্ট অবস্থা</div>
              <div class="value">
                <span class="status ${adm.paymentStatus === 'paid' ? 'status-approved' : 'status-pending'}">
                  ${adm.paymentStatus === 'paid' ? 'পেইড (Paid)' : 'আনপেইড (Unpaid)'}
                </span>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>এই রশিদটি সিস্টেম জেনারেটেড। কোনো স্বাক্ষরের প্রয়োজন নেই।</p>
            <p>© ${new Date().getFullYear()} গৃহপাঠশালা। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  const classes = ['৬ষ্ঠ শ্রেণী', '৭ম শ্রেণী', '৮ম শ্রেণী', '৯ম শ্রেণী', '১০ম শ্রেণী', 'এসএসসি', '১১শ শ্রেণী', '১২শ শ্রেণী', 'এইচএসসি'];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-white tracking-tight">ভর্তি ফরম</h1>
        <p className="text-slate-400">গৃহপাঠশালায় ভর্তির জন্য নিচের তথ্যগুলো পূরণ করুন।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          <motion.form
            onSubmit={handleSubmit}
            className="bg-slate-900/50 border border-white/10 p-10 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <UserIcon size={14} className="text-emerald-500" /> শিক্ষার্থীর নাম
                </label>
                <input
                  required
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="পুরো নাম লিখুন"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <BookOpen size={14} className="text-emerald-500" /> কোর্স নির্বাচন করুন
                </label>
                <select
                  required
                  value={formData.courseId}
                  onChange={(e) => {
                    const selected = courses.find(c => c.id === e.target.value);
                    setFormData({ ...formData, courseId: e.target.value, courseTitle: selected?.title || '' });
                  }}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none appearance-none"
                >
                  <option value="" className="bg-slate-900">কোর্স বেছে নিন</option>
                  {courses.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <Users size={14} className="text-emerald-500" /> পিতার নাম
                </label>
                <input
                  required
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="পিতার নাম"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <Users size={14} className="text-emerald-500" /> মাতার নাম
                </label>
                <input
                  required
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="মাতার নাম"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <School size={14} className="text-emerald-500" /> স্কুলের নাম
                </label>
                <input
                  required
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="বর্তমান স্কুলের নাম"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <GraduationCap size={14} className="text-emerald-500" /> শ্রেণী
                </label>
                <select
                  required
                  value={formData.studentClass}
                  onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none appearance-none"
                >
                  {classes.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <MapPin size={14} className="text-emerald-500" /> জেলা
                </label>
                <input
                  required
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="আপনার জেলা"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <Send size={14} className="text-emerald-500" /> মোবাইল নম্বর
                </label>
                <input
                  required
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="মোবাইল নম্বর লিখুন"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2 ml-1">
                  <Send size={14} className="text-emerald-500" /> হোয়াটসঅ্যাপ নম্বর
                </label>
                <input
                  required
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="হোয়াটসঅ্যাপ নম্বর লিখুন"
                />
              </div>
            </div>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center gap-3 font-bold"
                >
                  <CheckCircle size={24} /> আবেদন সফলভাবে জমা দেওয়া হয়েছে!
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 font-bold"
                >
                  <AlertCircle size={24} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-slate-950 py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              {loading ? "প্রসেসিং হচ্ছে..." : <><Send size={24} /> আবেদন জমা দিন</>}
            </button>
          </motion.form>
        </div>

        {/* Status */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Clock className="text-emerald-500" /> আপনার আবেদনসমূহ
          </h2>
          <div className="space-y-5">
            {myAdmissions.length > 0 ? myAdmissions.map((adm, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 border border-white/10 p-6 rounded-[2rem] space-y-4 hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{format(new Date(adm.createdAt), 'MMM dd, yyyy')}</div>
                    <div className="text-white font-black text-lg group-hover:text-emerald-500 transition-colors">{adm.studentClass}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        adm.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {adm.paymentStatus === 'paid' ? 'পেইড (Paid)' : 'আনপেইড (Unpaid)'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      adm.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      adm.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {adm.status === 'approved' ? 'অনুমোদিত' : adm.status === 'rejected' ? 'প্রত্যাখ্যাত' : 'অপেক্ষমান'}
                    </div>
                    <button
                      onClick={() => handleDownloadReceipt(adm)}
                      className="p-2 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"
                      title="রশিদ ডাউনলোড করুন"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  {adm.status === 'pending' ? <Clock size={16} className="text-amber-500" /> : <CheckCircle size={16} className="text-emerald-500" />}
                  {adm.status === 'pending' ? 'আপনার আবেদনটি যাচাই করা হচ্ছে' : `আবেদনটি ${adm.status === 'approved' ? 'অনুমোদন করা হয়েছে' : 'প্রত্যাখ্যান করা হয়েছে'}`}
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[2rem] text-slate-500 italic">
                এখনো কোনো আবেদন করা হয়নি।
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
