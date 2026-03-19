import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, Component, ErrorInfo, ReactNode, lazy, Suspense } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { Layout } from './components';
import { motion } from 'motion/react';
import { GraduationCap, AlertCircle } from 'lucide-react';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const Admin = lazy(() => import('./components/Admin'));
const AdmissionForm = lazy(() => import('./components/AdmissionForm'));
const CourseList = lazy(() => import('./components/CourseList'));
const NoticeBoard = lazy(() => import('./components/NoticeBoard'));
const Routine = lazy(() => import('./components/Routine'));
const PastClasses = lazy(() => import('./components/PastClasses'));
const Blog = lazy(() => import('./components/Blog'));
const Auth = lazy(() => import('./components/Auth'));

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsedError = JSON.parse(this.state.error.message);
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} (${parsedError.operationType} on ${parsedError.path})`;
        }
      } catch (e) {
        errorMessage = this.state.error.message || String(this.state.error);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-[2rem] max-w-lg w-full text-center space-y-6">
            <AlertCircle className="mx-auto text-red-500" size={64} />
            <h1 className="text-2xl font-black">Application Error</h1>
            <p className="text-slate-400">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-500 text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
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
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
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
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Layout user={user} role={role}>
          <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-emerald-500"
              >
                <GraduationCap size={48} />
              </motion.div>
            </div>
          }>
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
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
