import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'motion/react';
import { Users, Search, Edit2, Check, X, Shield, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-3xl font-black text-white flex items-center gap-4">
          <Users className="text-emerald-500" size={32} /> ব্যবহারকারী ব্যবস্থাপনা
        </h2>
        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="ব্যবহারকারী খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-[1.5rem] pl-12 pr-6 py-3.5 text-sm text-white focus:border-emerald-500 outline-none transition-all shadow-xl backdrop-blur-xl font-bold"
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">ব্যবহারকারী</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">ইমেইল</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">রোল</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">যোগদান</th>
                <th className="p-8 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black border border-emerald-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/5">
                        {user.displayName?.[0] || 'U'}
                      </div>
                      <div className="font-bold text-white text-lg group-hover:text-emerald-500 transition-colors">{user.displayName || 'অজ্ঞাত'}</div>
                    </div>
                  </td>
                  <td className="p-8 text-slate-400 text-sm font-medium">{user.email}</td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {user.role === 'admin' ? 'এডমিন' : 'ছাত্র'}
                    </span>
                  </td>
                  <td className="p-8 text-slate-500 text-sm font-bold">
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="p-8">
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      className="p-3 hover:bg-white/10 rounded-xl text-slate-400 hover:text-emerald-500 transition-all hover:scale-110 active:scale-90 border border-transparent hover:border-white/10"
                      title={user.role === 'admin' ? "ছাত্র করুন" : "এডমিন করুন"}
                    >
                      {user.role === 'admin' ? <ShieldAlert size={20} /> : <Shield size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && !loading && (
          <div className="p-24 text-center text-slate-500 italic text-xl font-medium">কোনো ব্যবহারকারী পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
}
