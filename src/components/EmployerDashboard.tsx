import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase, isMockMode } from '../lib/supabase';
import { Job } from './JobComponents';
import { PostJobForm } from './PostJobForm';
import { Briefcase, Users, Clock, CheckCircle2, Plus, Trash2, ExternalLink, Pause, Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export const EmployerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    totalApplications: 0
  });

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
        }
      ]);
      setStats({
        active: 1,
        pending: 0,
        totalApplications: 5
      });
      setLoading(false);
      return;
    }
    if (user) {
      fetchEmployerData();
    }
  }, [user]);

  const fetchEmployerData = async () => {
    setLoading(true);
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Calculate stats
      const active = jobsData?.filter(j => j.status === 'active').length || 0;
      const pending = jobsData?.filter(j => j.status === 'pending').length || 0;
      
      // Fetch applications count
      const { count, error: appError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .in('job_id', jobsData?.map(j => j.id) || []);
      
      setStats({
        active,
        pending,
        totalApplications: count || 0
      });

    } catch (error) {
      console.error('Error fetching employer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوظيفة نهائياً؟')) return;
    
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      toast.success('تم حذف الوظيفة بنجاح');
      fetchEmployerData();
    } catch (error) {
      toast.error('فشل في حذف الوظيفة');
    }
  };

  const toggleJobStatus = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'pending' : 'active';
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', job.id);
      
      if (error) throw error;
      toast.success(newStatus === 'active' ? 'تم تفعيل الوظيفة' : 'تم إيقاف الوظيفة مؤقتاً');
      fetchEmployerData();
    } catch (error) {
      toast.error('فشل في تحديث حالة الوظيفة');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">لوحة تحكم صاحب العمل</h1>
          <p className="text-slate-500 dark:text-slate-400">مرحباً بك، {profile?.full_name || 'صاحب العمل'}</p>
        </div>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
        >
          {showPostForm ? 'إغلاق النموذج' : <><Plus size={20} /> نشر وظيفة جديدة</>}
        </button>
      </div>

      <AnimatePresence>
        {showPostForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 overflow-hidden"
          >
            <PostJobForm onSuccess={() => { setShowPostForm(false); fetchEmployerData(); }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">وظائف نشطة</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.active}</div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">بانتظار المراجعة</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pending}</div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">طلبات التقديم</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalApplications}</div>
            <a href="/dashboard/employer/applications" className="text-xs font-bold text-indigo-600 hover:underline">عرض الكل</a>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
              <Briefcase size={24} />
            </div>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">إجمالي الوظائف</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{jobs.length}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">وظائفي المنشورة</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">إجمالي {jobs.length} وظيفة</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{new Date(job.created_at).toLocaleDateString('ar-IQ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      job.status === 'active' 
                        ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}>
                      {job.status === 'active' ? 'نشط' : 'بانتظار المراجعة'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleJobStatus(job)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title={job.status === 'active' ? 'إيقاف مؤقت' : 'تفعيل'}
                      >
                        {job.status === 'active' ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <a
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="عرض الوظيفة"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <Briefcase className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
              <p className="text-slate-500 dark:text-slate-400 font-medium">لم تقم بنشر أي وظائف بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
