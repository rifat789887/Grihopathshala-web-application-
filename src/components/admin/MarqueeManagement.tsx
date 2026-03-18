import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'motion/react';
import { Settings, Save, Link as LinkIcon, Type } from 'lucide-react';

export default function MarqueeManagement() {
  const [formData, setFormData] = useState({
    text: '',
    link: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMarquee = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'marquee'));
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
      }
      setLoading(false);
    };
    fetchMarquee();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'marquee'), formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500 italic">Loading settings...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings className="text-emerald-500" /> Marquee Settings
      </h2>

      <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl space-y-8 shadow-2xl">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Marquee Preview</h3>
          <div className="bg-emerald-500/10 border border-emerald-500/20 py-3 overflow-hidden whitespace-nowrap rounded-xl">
            <motion.div
              animate={{ x: [400, -800] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="inline-block text-emerald-500 font-bold text-sm"
            >
              {formData.text || "Enter marquee text below..."}
            </motion.div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400 flex items-center gap-2"><Type size={14} /> Marquee Text</label>
            <textarea
              required
              rows={3}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none resize-none"
              placeholder="Enter the scrolling text advertisement..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400 flex items-center gap-2"><LinkIcon size={14} /> Link URL</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : <><Save size={18} /> {success ? "Saved Successfully!" : "Save Settings"}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
