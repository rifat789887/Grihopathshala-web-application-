import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Home, Layout, Admin, AdmissionForm, CourseList, NoticeBoard, Routine, PastClasses, Blog, Auth } from './components';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const isAdminEmail = currentUser.email === 'mdrifat.contact@gmail.com';
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (isAdminEmail && userData.role !== 'admin') {
            await setDoc(doc(db, 'users', currentUser.uid), { ...userData, role: 'admin' }, { merge: true });
            setRole('admin');
          } else {
            setRole(userData.role);
          }
        } else {
          // New user
          const role = isAdminEmail ? 'admin' : 'student';
          const newUserData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: role,
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', currentUser.uid), newUserData);
          setRole(role);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-emerald-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <GraduationCap size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} role={role}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/routine" element={<Routine />} />
          <Route path="/classes" element={<PastClasses />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admission" element={user ? <AdmissionForm user={user} /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/admin/*" 
            element={role === 'admin' ? <Admin /> : <Navigate to="/" />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}
