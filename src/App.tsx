import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JobCard, JobFilterSection, Job } from './components/JobComponents';
import { EmployerDashboard } from './components/EmployerDashboard';
import { EmployerApplications } from './components/EmployerApplications';
import { JobDetails } from './components/JobDetails';
import { UserProfile } from './components/UserProfile';
import { Auth } from './components/Auth';
import { Toaster } from 'react-hot-toast';
import { supabase, isMockMode } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Briefcase } from 'lucide-react';

const HomePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', type: '', salary: '' });

  useEffect(() => {
    if (isMockMode) {
      setJobs([
        {
          id: '1',
          title: 'مطور واجهات أمامية (React)',
          company: 'شركة التقنية العراقية',
          location: 'بغداد، المنصور',
          salary: '1,500,000 د.ع',
          type: 'دوام كامل',
          category: 'تكنولوجيا',
          created_at: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          title: 'مهندس مدني',
          company: 'مجموعة البناء الحديثة',
          location: 'البصرة، حي الجزائر',
          salary: '2,000,000 د.ع',
          type: 'عقد',
          category: 'هندسة',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'active'
        },
        {
          id: '3',
          title: 'محاسب مالي',
          company: 'مصرف الرافدين الأهلي',
          location: 'أربيل، شارع 60',
          salary: '1,200,000 د.ع',
          type: 'دوام كامل',
          category: 'إدارة ومحاسبة',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          status: 'active'
        }
      ]);
      setLoading(false);
      return;
    }
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.type) query = query.eq('type', filters.type);

      const { data, error } = await query;
      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([
        {
          id: '1',
          title: 'مطور واجهات أمامية (React)',
          company: 'شركة التقنية العراقية',
          location: 'بغداد، المنصور',
          salary: '1,500,000 د.ع',
          type: 'دوام كامل',
          category: 'تكنولوجيا',
          created_at: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          title: 'مهندس مدني',
          company: 'مجموعة البناء الحديثة',
          location: 'البصرة، حي الجزائر',
          salary: '2,000,000 د.ع',
          type: 'عقد',
          category: 'هندسة',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">أحدث الوظائف</h2>
            <p className="text-slate-500 dark:text-slate-400">اكتشف الفرص الوظيفية المتاحة حالياً في مختلف المحافظات</p>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث عن وظيفة..."
              className="pr-10 pl-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        <JobFilterSection onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-500 font-medium">جاري تحميل الوظائف...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800"
                >
                  <Briefcase className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">لا توجد وظائف متاحة حالياً</h3>
                  <p className="text-slate-500 dark:text-slate-400">حاول تغيير معايير البحث أو الفلترة</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
    </main>
  );
};

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  if (!user) return <Navigate to="/auth" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
          <Toaster position="top-center" />
          <Navbar />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard/employer" 
              element={
                <ProtectedRoute role="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/employer/applications" 
              element={
                <ProtectedRoute role="employer">
                  <EmployerApplications />
                </ProtectedRoute>
              } 
            />
            {/* Add more routes as needed */}
          </Routes>

          <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">🚀</div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">منصة التوظيف</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    المنصة الأولى والوحيدة في العراق التي تربط بين الباحثين عن عمل والشركات مباشرة بكل شفافية.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6">روابط سريعة</h4>
                  <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                    <li><a href="/jobs" className="hover:text-indigo-600 transition-colors">تصفح الوظائف</a></li>
                    <li><a href="/companies" className="hover:text-indigo-600 transition-colors">الشركات</a></li>
                    <li><a href="/about" className="hover:text-indigo-600 transition-colors">عن المنصة</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6">تواصل معنا</h4>
                  <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                    <li>info@job-board.iq</li>
                    <li>+964 770 000 0000</li>
                    <li className="pt-2">
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-1">تنبيه العمولة</p>
                        <p className="text-xs">يتم دفع عمولة 10% من أول راتب فقط بعد التوظيف الناجح عبر المنصة.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100 dark:border-slate-900 text-center text-sm text-slate-400">
                © {new Date().getFullYear()} منصة التوظيف العراقية. جميع الحقوق محفوظة.
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
